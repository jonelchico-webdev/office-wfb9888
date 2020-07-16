import React, { useState, useEffect } from 'react';
import { EditorState, ContentState, convertFromHTML, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg"
import "./editor-show.css"

export default function EditorContainer(props) {
  const { defaultValue } = props
  const [editorState, setEditorState] = useState(null)

  useEffect(() => {
    setEditorState(      
        EditorState.createWithContent(defaultValue.length >= 36 ?
          convertFromRaw(JSON.parse(defaultValue)) :
          defaultValue.length === 0 || defaultValue === null ?
          ContentState.createFromBlockArray(convertFromHTML("没有讯息")) :
          ContentState.createFromBlockArray(convertFromHTML(defaultValue))
        )
    )
  }, [defaultValue])

  return <div>
    <Editor
      editorState={editorState}
      toolbarClassName="hide-toolbar"
      readOnly={true}
    />
  </div>
}