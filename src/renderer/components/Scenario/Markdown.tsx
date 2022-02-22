import { MarkDownStep } from 'types/scenario';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownProps {
  markdown: MarkDownStep;
}

const Markdown = ({ markdown }: MarkdownProps) => {
  return (
    <div>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children }) {
            console.log(node);
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? <div>Code here</div> : <code className={className}>{children}</code>;
          },
        }}
      >
        {markdown.content}
      </ReactMarkdown>
    </div>
  );
};
export default Markdown;
