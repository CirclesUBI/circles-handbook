import PropTypes from 'prop-types';
import React from 'react';

const FormattedImage = ({ relativesize, src, alt }) => (
  <img
    alt={alt}
    src={src}
    style={{
      width: relativesize,
      height: relativesize,
      padding: '1.2rem',
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
    }}
  />
);

FormattedImage.propTypes = {
  alt: PropTypes.string.isRequired,
  relativesize: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
};

export default FormattedImage;
