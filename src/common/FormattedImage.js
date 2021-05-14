import React from 'react';

const FormattedImage = ({relativesize, src, alt}) => (
    <img
      src={ src }
      alt={ alt }
      style={{
        width: relativesize,
        height: relativesize,
        padding: '1.2rem',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}/>
  );

export default FormattedImage;
