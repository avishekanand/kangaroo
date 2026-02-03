import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { formatMath } from '../utils/mathUtils';
import 'katex/dist/katex.min.css';

interface MathViewProps {
    content: string | null | undefined;
    className?: string;
    inline?: boolean;
}

export const MathView: React.FC<MathViewProps> = React.memo(({ content, className, inline }) => {
    if (!content) return null;

    return (
        <div className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    p: inline ? ({ node, ...props }) => <span {...props} /> : ({ node, ...props }) => <p {...props} />,
                }}
            >
                {formatMath(content)}
            </ReactMarkdown>
        </div>
    );
});

MathView.displayName = 'MathView';
