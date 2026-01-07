import Editor from "@monaco-editor/react";
import '../styles/global.css'
import {Button} from "@/components/ui/button.tsx";
import {PlayIcon} from "lucide-react";
import {Spinner} from "@/components/ui/spinner.tsx";
import {useEditor} from "@/hooks/useEditor.ts";

export default function Cell({code}:{code:string}) {
    const {runCode, isCodeRunning, registerLanguage, height, mgCode, setMgCode, out, theme} = useEditor(code)

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
                theme={theme == "dark" ? "hc-black" : "vs-light"}
                language={"marigold"}
                defaultValue={mgCode}
                onMount={(editor,monaco) => {
                    registerLanguage(monaco);
                }}
                onChange={(e) => setMgCode(e ?? "")} />
            <hr className="" />
            <div className={""}>
                {out.map((item,index) => (<p className={"m-3 mb-2 mt-3"}>{item}</p>))}
            </div>
        </div>
    )
}