import React from 'react';

interface ConfusionMatrixProps {
  matrix: number[][];
  labels: string[];
  title: string;
}

const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({ matrix, labels, title }) => {
  const getColor = (value: number, max: number) => {
    const intensity = value / max;
    return `rgba(59, 130, 246, ${intensity})`;
  };

  const maxValue = Math.max(...matrix.flat());

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Predicted
              </th>
              {labels.map((label, index) => (
                <th key={index} className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="px-3 py-2 text-sm font-medium text-gray-900">
                  {labels[rowIndex]}
                </td>
                {row.map((value, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-3 py-2 text-sm text-center font-medium"
                    style={{ backgroundColor: getColor(value, maxValue) }}
                  >
                    <span className={value > maxValue * 0.5 ? 'text-white' : 'text-gray-900'}>
                      {value}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConfusionMatrix;