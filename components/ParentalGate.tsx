
import React, { useState, useEffect } from 'react';

interface ParentalGateProps {
  onSuccess: () => void;
  onCancel?: () => void;
  title?: string;
}

export const ParentalGate: React.FC<ParentalGateProps> = ({ onSuccess, onCancel, title = "Espace Parent" }) => {
  const [problem, setProblem] = useState({ a: 0, b: 0, result: 0 });
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    generateProblem();
  }, []);

  const generateProblem = () => {
    const a = Math.floor(Math.random() * 50) + 10;
    const b = Math.floor(Math.random() * 9) + 1;
    setProblem({ a, b, result: a + b });
    setUserInput('');
    setError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(userInput) === problem.result) {
      onSuccess();
    } else {
      setError(true);
      setTimeout(generateProblem, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-blue-600/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl sm:rounded-[3rem] p-4 sm:p-8 max-w-md w-full shadow-2xl border-4 sm:border-8 border-yellow-400 text-center my-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2 sm:mb-6">{title}</h2>
        <p className="text-sm sm:text-xl text-gray-600 mb-4 sm:mb-8 font-medium">
          Résous ce petit calcul :
        </p>
        
        <div className={`text-3xl sm:text-5xl font-bold mb-4 sm:mb-8 transition-colors ${error ? 'text-red-500' : 'text-gray-800'}`}>
          {problem.a} + {problem.b} = ?
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
          <input
            type="number"
            autoFocus
            inputMode="numeric"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="text-center text-2xl sm:text-4xl p-2 sm:p-4 bg-gray-100 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-blue-200 outline-none focus:border-blue-500 transition-colors"
            placeholder="?"
          />
          <div className="flex gap-2 sm:gap-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 text-lg sm:text-xl font-bold py-2 sm:py-4 rounded-xl sm:rounded-2xl transition-transform active:scale-95"
              >
                Annuler
              </button>
            )}
            <button
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white text-lg sm:text-xl font-bold py-2 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg transition-transform active:scale-95"
            >
              Valider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
