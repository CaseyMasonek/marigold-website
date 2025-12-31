import {loadPyodide} from "pyodide";
import Editor from "@monaco-editor/react";
import {useEffect, useState} from "react";
import '../styles/global.css'
import {Button} from "@/components/ui/button.tsx";
import {PlayIcon} from "lucide-react";
import {Spinner} from "@/components/ui/spinner.tsx";

export default function Cell({code}:{code:string}) {
    function registerLanguage(monaco: typeof import("monaco-editor")) {
        monaco.languages.register({ id: "marigold" });

        monaco.languages.setMonarchTokensProvider("marigold", {
            tokenizer: {
                root: [
                    [/\b(def|defr|if|else|guard|module|use|alias|self|true|false|nil)\b/, "keyword"],
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

    const [out,setOut] = useState<string[]>([]);
    const [mgCode,setMgCode] = useState(code);
    const [pyodide,setPyodide] = useState<any>();
    const [isCodeRunning,setIsCodeRunning] = useState<boolean>(false);
    const [height,setHeight] = useState("0");

    useEffect(() => {
        setHeight(((mgCode.split("\n").length * 2)+2).toString() + "vh")
    },[mgCode])

    useEffect(() => {
        const initPyodide = async () => {
            const p = await loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.0/full/",
                stdout: (text) => setOut(l => l.concat([text])),
                stderr: (text) => setOut(out.concat([text])),
                stdin: () => prompt(out[-1])
            });

            setPyodide(p)
        }

        initPyodide();
    },[])

    const runCode = () => {
        setOut([])


        const getCode = async () => {
            setIsCodeRunning(true)
            const res = await fetch(import.meta.env.PUBLIC_SERVER_URL, {
                method:"POST",
                mode:"cors",
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify({"code":mgCode}),
            })

            if (res.ok) {
                const json = await res.json();

                console.log(json);

                const pycode = json.code;

                const output = pyodide.runPython(pycode)

                console.log(output);
            } else {
                setOut(["Syntax error! (Maybe you forgot a semicolon?) "]);
            }

            setIsCodeRunning(false)
        }

        getCode();
    }

    return (
        <div className="w-[40%] border-2 rounded-lg m-3">
            <div className="h-10 bg-accent flex items-center justify-end mb-2 relative">
                <p className={"absolute left-2 text-sm"}>marigold</p>
                <Button
                    onClick={runCode}
                    variant={"ghost"}
                    disabled={isCodeRunning}
                    className={"m-3"}>


                     {isCodeRunning ? <><Spinner /> Loading...</> : <><PlayIcon size={8} />Run</>}
                </Button>
            </div>
            <Editor
                height={height}
                className={""}
                options={{
                    scrollBeyondLastLine: false,
                    scrollbar: {
                        scrollByPage: true,
                    }
                }}
                theme={"gh-light"}
                language={"marigold"}
                defaultValue={mgCode}
                onMount={(editor,monaco) => {
                    registerLanguage(monaco);
                }}
                onChange={(e) => setMgCode(e ?? "")} />
            <hr className="" />
            {out.map((item,index) => (<p className={"m-3 mb-2 mt-3"}>{item}</p>))}
        </div>
    )
}