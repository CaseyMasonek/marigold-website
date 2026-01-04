import Editor from "@monaco-editor/react";
import '../styles/global.css'
import {Button} from "@/components/ui/button.tsx";
import {CodeIcon, PlayIcon} from "lucide-react";
import {Spinner} from "@/components/ui/spinner.tsx";
import {useEditor} from "@/hooks/useEditor.ts";

export default function PlaygroundComponent() {
    const defaultCode = `defr fibonacci(n) {
    # Calculate n! #
    
    guard (n < 2) n;
    
    (self (n - 1)) + (self (n - 2));
}

n = 10;

putint (fibonacci n);`

    const {runCode, isCodeRunning, registerLanguage, mgCode, setMgCode, out, theme} = useEditor(defaultCode);

    return (
        <div className="grid grid-cols-2">
            <div className={'m-3'}>
                <Editor
                    height={'90vh'}
                    theme={theme == "dark" ? "hc-black" : "vs-light"}
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
                        <Button onClick={runCode} disabled={isCodeRunning} className={"m-3 w-35"}>
                            {isCodeRunning ? <><Spinner /> Loading...</> : <><PlayIcon size={8} />Run</>}
                        </Button>
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