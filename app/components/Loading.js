import React from 'react';

import IntroPage from './IntroPage';
import loadingSVG from '../assets/loading.svg';

export default function Loading(props) {
  return (
    <IntroPage>
      <div>
        <img src={loadingSVG} />
      </div>
    </IntroPage>
  );
}
