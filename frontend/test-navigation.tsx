'use client';

export default function TestNavigation() {
  const handleClick = () => {
    console.log('Test navigation clicked');
  };

  return (
    <div className="p-4 bg-blue-500 text-white">
      <button onClick={handleClick}>
        Test Navigation Click
      </button>
    </div>
  );
}
