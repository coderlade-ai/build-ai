"use client";

import Editor, { loader, type OnMount } from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import { languageForPath, monacoBasePath } from "./language";

// Must run before the first editor mounts, or the loader falls back to its CDN default.
loader.config({ paths: { vs: monacoBasePath } });

export interface CodeEditorProps {
  path: string;
  value: string;
  loadingLabel: string;
  onChange: (value: string) => void;
  onSave: () => void;
  /** Showing the agent's file as it streams in: not editable, and kept scrolled to the end. */
  readOnly?: boolean;
}

/** Monaco, self-hosted. Presentation only: the project store stays the source of truth. */
export function CodeEditor({
  path,
  value,
  loadingLabel,
  onChange,
  onSave,
  readOnly = false,
}: CodeEditorProps) {
  const save = useRef(onSave);
  save.current = onSave;
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  useEffect(() => {
    const editor = editorRef.current;
    const lines = editor?.getModel()?.getLineCount();
    if (readOnly && editor && lines) editor.revealLine(lines);
  }, [readOnly, value]);

  const onMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => save.current());
    // Generated projects are type-checked by their own toolchain; keep the editor quiet but useful.
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
      allowJs: true,
      allowNonTsExtensions: true,
      target: monaco.languages.typescript.ScriptTarget.ES2022,
    });
  };

  return (
    <Editor
      path={path}
      language={languageForPath(path)}
      value={value}
      theme="vs-dark"
      loading={<span role="status">{loadingLabel}</span>}
      onChange={(v) => onChange(v ?? "")}
      onMount={onMount}
      options={{
        fontFamily: '"JetBrains Mono", ui-monospace, Menlo, monospace',
        fontSize: 14,
        lineHeight: 22,
        tabSize: 2,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: "off",
        renderWhitespace: "selection",
        padding: { top: 12, bottom: 64 },
        readOnly,
        domReadOnly: readOnly,
      }}
    />
  );
}
