import ToolButton from './ToolButton';

function Tools({ editor }: any) {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap justify-between bg-gray-200 z-10 rounded-md border-2 sticky top-0">
      <div>
        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
        >
          H1
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          toggleOrderedList
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
        >
          H3
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={'ml-2 '}
          isActive={editor.isActive('bold')}
        >
          bold
        </ToolButton>
        <ToolButton
          onClick={() => editor.chain().focus().toggleHighlight({ color: '#8ce99a' }).run()}
          isActive={editor.isActive('highlight', { color: '#8ce99a' })}
        >
          highlight
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          undo
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          redo
        </ToolButton>
      </div>
    </div>
  );
}

export default Tools;