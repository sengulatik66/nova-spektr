import { render, screen } from '@testing-library/react';

import SplashScreen from './SplashScreen';

describe('SplashScreen', () => {
  test('should render component', () => {
    render(<SplashScreen />);

    const logo = screen.getByTestId('logo-img');
    expect(logo).toBeInTheDocument();
  });
});