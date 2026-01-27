import { useCallback, useEffect, useRef, useState } from 'react'
import {
  EditorProvider,
  PortableTextEditable,
  defineSchema,
  useEditor,
  usePortableTextEditor,
  type PortableTextBlock,
  type RenderDecoratorFunction,
  type RenderStyleFunction,
  type RenderBlockFunction,
  type RenderListItemFunction,
} from '@portabletext/editor'
import { EventListenerPlugin } from '@portabletext/editor/plugins'
import { type DocumentHandle, useDocument, useEditDocument } from '@sanity/sdk-react'
import './PortableTextField.css'

interface PortableTextFieldProps {
  handle: DocumentHandle
  fieldKey: string
}

// Define a basic schema for the editor
const schemaDefinition = defineSchema({
  decorators: [
    { name: 'strong' },
    { name: 'em' },
    { name: 'underline' },
    { name: 'strike-through' },
    { name: 'code' },
  ],
  styles: [
    { name: 'normal' },
    { name: 'h1' },
    { name: 'h2' },
    { name: 'h3' },
    { name: 'h4' },
    { name: 'blockquote' },
  ],
  lists: [
    { name: 'bullet' },
    { name: 'number' },
  ],
  annotations: [],
  inlineObjects: [],
  blockObjects: [],
})

// Render functions for the editor
const renderStyle: RenderStyleFunction = (props) => {
  switch (props.schemaType.name) {
    case 'h1':
      return <h1 className="pte-h1">{props.children}</h1>
    case 'h2':
      return <h2 className="pte-h2">{props.children}</h2>
    case 'h3':
      return <h3 className="pte-h3">{props.children}</h3>
    case 'h4':
      return <h4 className="pte-h4">{props.children}</h4>
    case 'blockquote':
      return <blockquote className="pte-blockquote">{props.children}</blockquote>
    default:
      return <p className="pte-paragraph">{props.children}</p>
  }
}

const renderDecorator: RenderDecoratorFunction = (props) => {
  switch (props.value) {
    case 'strong':
      return <strong>{props.children}</strong>
    case 'em':
      return <em>{props.children}</em>
    case 'underline':
      return <u>{props.children}</u>
    case 'strike-through':
      return <s>{props.children}</s>
    case 'code':
      return <code className="pte-inline-code">{props.children}</code>
    default:
      return <>{props.children}</>
  }
}

const renderBlock: RenderBlockFunction = (props) => {
  return <div className="pte-block">{props.children}</div>
}

const renderListItem: RenderListItemFunction = (props) => {
  return <li className="pte-list-item">{props.children}</li>
}

export function PortableTextField({ handle, fieldKey }: PortableTextFieldProps) {
  const { data: value } = useDocument({ ...handle, path: fieldKey })
  const editField = useEditDocument({ ...handle, path: fieldKey })

  // Track if the value is valid portable text
  const isPortableText = Array.isArray(value) && value.length > 0 &&
    value.every((block: unknown) =>
      typeof block === 'object' && block !== null && '_type' in block
    )

  if (!isPortableText && value !== undefined && value !== null) {
    return (
      <div className="portable-text-field portable-text-field-invalid">
        <p className="portable-text-field-error">
          This field does not contain valid Portable Text data.
        </p>
        <details>
          <summary>View raw data</summary>
          <pre className="portable-text-field-json">
            {JSON.stringify(value, null, 2)}
          </pre>
        </details>
      </div>
    )
  }

  const initialValue = isPortableText ? (value as PortableTextBlock[]) : undefined

  return (
    <div className="portable-text-field">
      <EditorProvider
        initialConfig={{
          schemaDefinition,
          initialValue,
        }}
      >
        <PortableTextToolbar />
        <PortableTextEditorWrapper onValueChange={editField} />
      </EditorProvider>
    </div>
  )
}

interface PortableTextEditorWrapperProps {
  onValueChange: (value: PortableTextBlock[] | undefined) => void
}

function PortableTextEditorWrapper({ onValueChange }: PortableTextEditorWrapperProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const handleMutation = useCallback((event: { type: string; value?: PortableTextBlock[] }) => {
    if (event.type === 'mutation') {
      // Debounce updates to avoid excessive writes
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      debounceRef.current = setTimeout(() => {
        onValueChange(event.value)
      }, 300)
    }
  }, [onValueChange])

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return (
    <>
      <EventListenerPlugin on={handleMutation} />
      <PortableTextEditable
        className="portable-text-editable"
        renderStyle={renderStyle}
        renderDecorator={renderDecorator}
        renderBlock={renderBlock}
        renderListItem={renderListItem}
      />
    </>
  )
}

function PortableTextToolbar() {
  const editor = useEditor()

  const applyDecorator = (decorator: string) => {
    editor.send({
      type: 'decorator.toggle',
      decorator,
    })
  }

  const applyStyle = (style: string) => {
    editor.send({
      type: 'style.toggle',
      style,
    })
  }

  const applyList = (listItem: string) => {
    editor.send({
      type: 'list item.toggle',
      listItem,
    })
  }

  return (
    <div className="portable-text-toolbar">
      <div className="portable-text-toolbar-group">
        <button
          type="button"
          className="portable-text-toolbar-button"
          onClick={() => applyDecorator('strong')}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className="portable-text-toolbar-button"
          onClick={() => applyDecorator('em')}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className="portable-text-toolbar-button"
          onClick={() => applyDecorator('underline')}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <button
          type="button"
          className="portable-text-toolbar-button"
          onClick={() => applyDecorator('strike-through')}
          title="Strikethrough"
        >
          <s>S</s>
        </button>
        <button
          type="button"
          className="portable-text-toolbar-button"
          onClick={() => applyDecorator('code')}
          title="Code"
        >
          <code>&lt;/&gt;</code>
        </button>
      </div>

      <div className="portable-text-toolbar-divider" />

      <div className="portable-text-toolbar-group">
        <button
          type="button"
          className="portable-text-toolbar-button"
          onClick={() => applyStyle('h1')}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          className="portable-text-toolbar-button"
          onClick={() => applyStyle('h2')}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          className="portable-text-toolbar-button"
          onClick={() => applyStyle('h3')}
          title="Heading 3"
        >
          H3
        </button>
        <button
          type="button"
          className="portable-text-toolbar-button"
          onClick={() => applyStyle('blockquote')}
          title="Blockquote"
        >
          &ldquo;
        </button>
      </div>

      <div className="portable-text-toolbar-divider" />

      <div className="portable-text-toolbar-group">
        <button
          type="button"
          className="portable-text-toolbar-button"
          onClick={() => applyList('bullet')}
          title="Bullet List"
        >
          •
        </button>
        <button
          type="button"
          className="portable-text-toolbar-button"
          onClick={() => applyList('number')}
          title="Numbered List"
        >
          1.
        </button>
      </div>
    </div>
  )
}
