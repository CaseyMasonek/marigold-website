import {useEffect, useState} from "react";
import {loadPyodide} from "pyodide";
import {useStore} from "@nanostores/react";
import {$theme} from "@/store/theme.ts";

export const useEditor = (code:string) => {
    function registerLanguage(monaco: typeof import("monaco-editor")) {
        monaco.languages.register({ id: "marigold" });

        monaco.languages.setMonarchTokensProvider("marigold", {
            tokenizer: {
                root: [
                    [/\b(def|defr|if|else|guard|module|alias|self|true|false|nil|elif|import|importall|unpack)\b/, "keyword"],
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

                try {
                    const output = pyodide.runPython(pycode)
                    console.log(output);
                } catch (error:any) {
                    setOut([error.message]);
                }


            } else {
                setOut(["Syntax error! (Maybe you forgot a semicolon?) "]);
            }

            setIsCodeRunning(false)
        }

        getCode();
    }

    const theme = useStore($theme)

    return {height,runCode,isCodeRunning,mgCode,out,setMgCode,registerLanguage,theme};
}