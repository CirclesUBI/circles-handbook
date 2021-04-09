import React from 'react';

const FormattedImage = ({relativeSize, src, alt}) => (
    <img
      src={ src }
      alt={ alt }
      style={{
        width: relativeSize,
        height: relativeSize,
        padding: '1.2rem',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}/>
  );

export default FormattedImage;
