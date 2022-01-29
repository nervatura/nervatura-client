import PropTypes from 'prop-types';
import { useEditor, EditorContent } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'

import styles from './Note.module.css';

import Icon from 'components/Form/Icon'
import Button from 'components/Form/Button'
import Select from 'components/Form/Select'

export const Note = ({ 
  value, patternId, patterns, readOnly, lastUpdate, className,
  getText, onEvent,
  ...props 
}) => {  
  const editor = useEditor({
    extensions: [ Document, Paragraph, Text, Bold, Italic ],
    content: value,
    onUpdate({ editor }) {
      /* istanbul ignore next */
      onEvent("editItem", [{ name: "fnote", value: editor.getHTML() }])
    },
    editable: !readOnly,
    autofocus: "end"
  },[lastUpdate])
  if (!editor) {
    return null
  }
  
  return (
    <div {...props} className={`${styles.formPanel} ${"border"} ${className}`} >
      {(!readOnly)?<div>
        <div className="row full" >
          <div className={`${"cell padding-small"}`} >
            <div className="cell padding-tiny">
              <Button id="btn_pattern_default"
                className={`${"border-button"} ${styles.barButton}`}
                title={getText("pattern_default")}
                onClick={ ()=>onEvent("setPattern",[{ key: "default" }]) }
                value={<Icon iconKey="Home" />}
              />
              <Button id="btn_pattern_load"
                className={`${"border-button"} ${styles.barButton}`}
                title={getText("pattern_load")}
                onClick={ ()=>onEvent("setPattern",[{ key: "load" }]) }
                value={<Icon iconKey="Download" />}
              />
              <Button id="btn_pattern_save"
                className={`${"border-button"} ${styles.barButton}`}
                title={getText("pattern_save")}
                onClick={ ()=>onEvent("setPattern",[{ key: "save"}]) }
                value={<Icon iconKey="Upload" />}
              />
            </div>
            <div className="cell padding-tiny">
              <Button id="btn_pattern_new"
                className={`${"border-button"} ${styles.barButton}`}
                title={getText("pattern_new")}
                onClick={ ()=>onEvent("setPattern",[{ key: "new"}]) }
                value={<Icon iconKey="Plus" />}
              />
              <Button id="btn_pattern_delete"
                className={`${"border-button"} ${styles.barButton}`}
                title={getText("pattern_delete")}
                onClick={ ()=>onEvent("setPattern",[{ key: "delete"}]) }
                value={<Icon iconKey="Times" />}
              />
            </div>
            <div className="cell padding-tiny mobile" >
              <Select id="sel_pattern"
                value={(patternId) ? String(patternId) : ""} placeholder=""
                onChange={ (value)=>onEvent("changeCurrentData",["template", value]) }
                options={patterns.map( pattern => {
                  return { value: String(pattern.id), 
                    text: pattern.description+((pattern.defpattern === 1)?"*":"") 
                }})} />
            </div>
            <div className="cell padding-tiny">
              <Button id="btn_bold" title="Bold"
                className={`${"border-button"} ${styles.barButton} ${
                  /* istanbul ignore next */
                  (editor && editor.isActive("bold")) ? styles.activeStyle : ""
                }`} 
                onClick={ () => editor.chain().focus().toggleBold().run() }
                value={<Icon iconKey="Bold" />}
              />
              <Button id="btn_italic" title="Italic"
                className={`${"border-button"} ${styles.barButton} ${
                  /* istanbul ignore next */
                  (editor && editor.isActive("italic")) ? styles.activeStyle : ""
                }`} 
                onClick={ () => editor.chain().focus().toggleItalic().run() }
                value={<Icon iconKey="Italic" />}
              />
            </div>
          </div>
        </div>
      </div>:null}
      <div className={`${styles.rtfEditor} ${"rtf"}`} >
        <EditorContent id="note_editor" editor={editor} />
      </div>
    </div>
  )
}

Note.propTypes = {
  value: PropTypes.string, 
  patternId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), 
  patterns: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    defpattern: PropTypes.number.isRequired
  })).isRequired,
  readOnly: PropTypes.bool.isRequired, 
  lastUpdate: PropTypes.number,
  className: PropTypes.string,
  onEvent: PropTypes.func,
  getText: PropTypes.func,
}

Note.defaultProps = {
  value: "",
  patternId: undefined,
  patterns: [],
  className: "",
  readOnly: false,
  lastUpdate: undefined,
  onEvent: undefined,
  getText: undefined,
}

export default Note;