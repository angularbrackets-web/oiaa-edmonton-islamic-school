'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon as UnderlineIconHero,
  ListBulletIcon,
  NumberedListIcon,
  LinkIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline'

interface TipTapEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function TipTapEditor({ content, onChange, placeholder }: TipTapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-terracotta-red underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[200px] px-4 py-3',
      },
    },
  })

  if (!editor) {
    return null
  }

  const setLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const MenuButton = ({ onClick, active, title, children }: any) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        active ? 'bg-terracotta-red/10 text-terracotta-red' : 'text-gray-700'
      }`}
    >
      {children}
    </button>
  )

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <BoldIcon className="w-5 h-5" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <ItalicIcon className="w-5 h-5" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline"
        >
          <UnderlineIconHero className="w-5 h-5" />
        </MenuButton>

        <div className="w-px bg-gray-300 mx-1"></div>

        {/* Headings */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <span className="font-bold text-sm">H2</span>
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <span className="font-bold text-sm">H3</span>
        </MenuButton>

        <div className="w-px bg-gray-300 mx-1"></div>

        {/* Lists */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <ListBulletIcon className="w-5 h-5" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <NumberedListIcon className="w-5 h-5" />
        </MenuButton>

        <div className="w-px bg-gray-300 mx-1"></div>

        {/* Link */}
        <MenuButton
          onClick={setLink}
          active={editor.isActive('link')}
          title="Insert Link"
        >
          <LinkIcon className="w-5 h-5" />
        </MenuButton>

        {/* Code */}
        <MenuButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <CodeBracketIcon className="w-5 h-5" />
        </MenuButton>

        <div className="w-px bg-gray-300 mx-1"></div>

        {/* Alignment */}
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <span className="text-sm">⬅</span>
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <span className="text-sm">↕</span>
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <span className="text-sm">➡</span>
        </MenuButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
