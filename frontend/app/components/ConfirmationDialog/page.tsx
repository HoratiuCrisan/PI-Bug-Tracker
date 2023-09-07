import React from 'react'

interface ConfirmButton {
  onOk: () => void
  text:string;
}

const ConfirmDialog: React.FC<ConfirmButton> = ({
  onOk,
  text
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>
          {text}
        </p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onOk}
            className="px-4 py-2 mr-2 text-blue-500 hover:bg-gray-100 hover:rounded-md"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog;
