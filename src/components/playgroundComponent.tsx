import {loadPyodide} from "pyodide";
import Editor from "@monaco-editor/react";
import {useEffect, useState} from "react";
import '../styles/global.css'
import {Button} from "@/components/ui/button.tsx";
import {CodeIcon, PlayIcon} from "lucide-react";

export default function PlaygroundComponent() {
    function registerLanguage(monaco: typeof import("monaco-editor")) {
        monaco.languages.register({ id: "marigold" });

        monaco.languages.setMonarchTokensProvider("marigold", {
            tokenizer: {
                root: [
                    [/\b(def|defr|if|else|guard|module|use|alias|true|false|self)\b/, "keyword"],
                    [/\b(PAIR)\b/, "constant"],
                    [/\d+/, "number"],
                    [/"([^"\\]|\\.)*$/, "string.invalid"],
                    [/"([^"\\]|\\.)*"/, "string"],
                    [/#.*#/, "comment"],
                    [/[{}()[\]]/, "@brackets"],
                    [/[+\-*\/=<>!|]+/, "operator"],
                    [/[a-zA-Z_]\w*/, "identifier"],
                ]
            }
        });
    }

    const initialCode = `defr factorial(n) {
    # Calculate n! #
    
    guard (n == 0) 1;
    
    n * (self n--);
}

putint (factorial 5);`

    const [out,setOut] = useState<string[]>([]);
    const [mgCode,setMgCode] = useState(initialCode);
    const [pyodide,setPyodide] = useState<any>();
    const [isCodeRunning,setIsCodeRunning] = useState<boolean>(false);

    useEffect(() => {
        const initPyodide = async () => {
            const p = await loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.0/full/",
                stdout: (text) => setOut(out.concat([text])),
                stderr: (text) => console.error(`Python error: ${text}`),
                stdin: () => prompt(out[-1])
            });

            setPyodide(p)
        }

        initPyodide();
    },[])

    const runCode = () => {
        setOut([])
        setIsCodeRunning(true)

        const getCode = async () => {
            const res = await fetch("http://localhost:8000",{
                method:"POST",
                mode:"cors",
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({"code":mgCode}),
            })

            const json = await res.json();

            console.log(json);

            const pycode = json.code;

            const output = pyodide.runPython(pycode)

            console.log(output);
        }

        getCode();
        setIsCodeRunning(false)
    }

    return (
        <div className="grid grid-cols-2">
            <div className={'m-3'}>
                <Editor
                    height={'90vh'}
                    theme={"gh-light"}
                    language={"marigold"}
                    defaultValue={mgCode}
                    onMount={(editor,monaco) => {
                        registerLanguage(monaco);
                    }}
                    onChange={(e) => setMgCode(e ?? "")} />
            </div>

            <div className={"border-l-1 w-full"}>
                <div className={'inline-flex flex-row justify-between align-middle items-center w-full p-1'}>
                    <div className={'grid grid-cols-2 w-20 pl-3'}>
                        <CodeIcon className="mt-1" />
                        <h1 className={"text-2xl inline align-middle"}>Playground</h1>
                    </div>
                    <div className={"inline"}>
                        <Button onClick={runCode} disabled={isCodeRunning} className={"m-3"}><PlayIcon />Run</Button>
                    </div>
                </div>
                <hr />
                <div className={"p-3"}>
                    {out.map((item,index) => (<p>{item}</p>))}
                </div>
            </div>
        </div>
    )
}