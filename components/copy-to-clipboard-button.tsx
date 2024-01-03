import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const CopyToClipboardButton = () => {
  const [value, setValue] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    // You can perform additional actions after copying if needed
  };

  return (
    <div>
      <input
        value={value}
        onChange={({ target: { value } }) => {
          setValue(value);
          setCopied(false);
        }}
      />

      <CopyToClipboard text={value} onCopy={handleCopy}>
        <button>Copy to clipboard</button>
      </CopyToClipboard>

      {copied && <span style={{ color: 'red' }}>Copied.</span>}
    </div>
  );
};

export default CopyToClipboardButton;
