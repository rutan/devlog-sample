import { FONT_FAMILY_MAIN } from '../constants';

export interface OutlineTextProps {
  text: string;
  fontSize: number;
  width: number;
  height: number;
  textColor?: string;
  outlineColor?: string;
  strokeWidth?: number;
  lineHeight?: number;
}

export const OutlineText = ({
  text,
  fontSize,
  width,
  height,
  textColor = 'white',
  outlineColor = 'black',
  strokeWidth = 16,
  lineHeight = 1.5,
}: OutlineTextProps) => {
  const lines = text.split('\n');
  const totalHeight = lines.length * lineHeight * fontSize;
  const offset = -(totalHeight / 2) + fontSize * 0.8;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
    >
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fontSize}
        fontFamily={FONT_FAMILY_MAIN}
        fill={textColor}
        stroke={outlineColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        paintOrder="stroke fill"
      >
        {lines.map((line, i) => (
          <tspan
            key={i}
            x="50%"
            y={`${50 + (offset / height) * 100}%`}
            dy={`${i * lineHeight}em`}
          >
            {line}
          </tspan>
        ))}
      </text>
    </svg>
  );
};
