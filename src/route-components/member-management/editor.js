import React, {Component, } from 'react';
import {EditorState, convertToRaw, ContentState, convertFromHTML, convertFromRaw } from "draft-js";
import {Editor} from "react-draft-wysiwyg"
import "./editor.css"

function uploadImageCallBack(file) {
  const imageObject = {
    file: file,
    localSrc: URL.createObjectURL(file)
  }

  return new Promise(
    (resolve, reject) => {
      resolve({ data: { link: imageObject.localSrc } })
    }
  )
}


export default class EditorContainer extends Component{
  constructor(props){
    super(props);

    if(this.props.defaultValue && this.props.defaultValue !== "null") {
        if(this.props.defaultValue.length >= 30) {
          this.state = {
            editorState: EditorState.createWithContent(
                convertFromRaw(JSON.parse(this.props.defaultValue))
            ),
          };
        } else if(this.props.defaultValue.length <= 29 && this.props.defaultValue !== "null"){
          this.state = {
            editorState: EditorState.createWithContent(
              ContentState.createFromBlockArray(
                convertFromHTML(this.props.defaultValue)
              )
            ),
          };
        } 
        // else {
        //   // this.state = {
        //   //   editorState: EditorState.createEmpty(),
        //   // }
        //   this.state = {
        //     editorState: EditorState.createWithContent(
        //       ContentState.createFromBlockArray(
        //         convertFromHTML("在此输入 ....")
        //       )
        //     ),
        //   };
        // }
    } else {
      this.state = {
        editorState: EditorState.createEmpty(),
      };
    }
  }
  
  onEditorStateChange: Function = (editorState) => {
    let rawState = convertToRaw(editorState.getCurrentContent())
    let stringState = JSON.stringify(rawState)
    this.setState({
      editorState,
    });
    this.props.setContent(
      stringState
    )
  };

  uploadImageCallBack(file) {
  
    const imageObject = {
      file: file,
      localSrc: URL.createObjectURL(file)
    }
  
    return new Promise(
      (resolve, reject) => {
        resolve({ data: { link: imageObject.localSrc } })
      }
    )
    // return new Promise(
    //   (resolve, reject) => {
    //     const xhr = new XMLHttpRequest();
    //     xhr.open('POST', './image.api');
    //     xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
    //     const data = new FormData();
    //     data.append('image', file);
    //     xhr.send(data);
    //     xhr.addEventListener('load', () => {
    //       const response = JSON.parse(xhr.responseText);
    //       resolve(response);
    //     });
    //     xhr.addEventListener('error', () => {
    //       const error = JSON.parse(xhr.responseText);
    //       reject(error);
    //     });
    //   }
    // );
  }

  render(){
    const { editorState } = this.state;
    // let raw = convertToRaw(this.state.editorState.getCurrentContent())
    // let strings = JSON.stringify(raw)

    return <div className='editor'>
      <Editor
        editorState={editorState}
        onEditorStateChange={this.onEditorStateChange}    
        toolbar={{
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: true },
          image: { 
            uploadCallback: this.uploadImageCallBack, 
            uploadEnabled: true,
            previewImage: true,
            alt: { present: true, mandatory: true },
          },
        }}
        placeholder="在此输入 ...."
      />
    </div>
  }
}
