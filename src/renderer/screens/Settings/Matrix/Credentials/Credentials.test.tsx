import { render, screen, act } from '@testing-library/react';

import Credentials from './Credentials';
import { useMatrix } from '@renderer/context/MatrixContext';

jest.mock('@renderer/context/I18nContext', () => ({
  useI18n: jest.fn().mockReturnValue({
    t: (key: string) => key,
  }),
}));

jest.mock('@renderer/context/MatrixContext', () => ({
  useMatrix: jest.fn().mockReturnValue({
    matrix: { logout: jest.fn() },
  }),
}));

describe('screens/Settings/Matrix/Credentials', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render component', () => {
    render(<Credentials />);

    const title = screen.getByText('settings.matrix.formTitle');
    expect(title).toBeInTheDocument();
  });

  test('should logout from Matrix', async () => {
    const spyLogout = jest.fn();
    (useMatrix as jest.Mock).mockReturnValue({
      matrix: { logout: spyLogout },
    });
    render(<Credentials />);

    const button = screen.getByRole('button');
    await act(async () => button.click());

    expect(spyLogout).toBeCalled();
  });
});