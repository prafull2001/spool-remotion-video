// Simple CSS-based font loading for Quicksand
export const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&display=swap');
`;

export const FontLoader = () => {
  return (
    <style dangerouslySetInnerHTML={{ __html: fontStyles }} />
  );
};
