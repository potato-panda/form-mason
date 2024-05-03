import {
  fireEvent,
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import React from 'react';
import { describe, expect, it, test, vi } from 'vitest';
import { Toaster } from '../src/components/toaster/Toaster';
import EventBus from '../src/events/EventBus';

vi.mock('../src/events/EventBus', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../src/events/EventBus')>();
  return {
    default: new mod.EventBus(),
  };
});

describe('Toaster', () => {
  const MakeToastButton = ({ timeout }: { timeout?: number }) => {
    return (
      <button
        type="button"
        role="button"
        onClick={() => {
          EventBus.emit('toast', {
            type: 'info',
            header: 'test',
            message: 'This is a message',
            timeout,
          });
        }}
      >
        Make Toast
      </button>
    );
  };

  it('should make and eat toast', async () => {
    const { getByText, queryAllByRole, findAllByRole } = render(
      <>
        <MakeToastButton />
        <Toaster />
      </>
    );
    const emitSpy = vi.spyOn(EventBus, 'emit');
    fireEvent.click(getByText('Make Toast'));
    waitFor(() => expect(emitSpy).toBeCalledTimes(1));

    const alerts = queryAllByRole('alert');
    expect(alerts.length).toBe(1);
    expect(getByText('This is a message')).toBeTruthy();
    
    const closeButton = await findAllByRole('button');
    expect(closeButton[1]).toBeTruthy();
    fireEvent.click(closeButton[1]);
    waitFor(() => expect(emitSpy).toBeCalledTimes(1));
    const alertsAfterClose = queryAllByRole('alert');
    expect(alertsAfterClose.length).toBe(0);
  });

  test('toast should timeout', async () => {
    const { queryAllByRole, getByText } = render(
      <>
        <MakeToastButton timeout={1000} />
        <Toaster />
      </>
    );
    const emitSpy = vi.spyOn(EventBus, 'emit');
    fireEvent.click(getByText('Make Toast'));
    waitFor(() => expect(emitSpy).toBeCalledTimes(1));
    
    const alerts = queryAllByRole('alert');
    expect(alerts.length).toBe(1);
    await waitForElementToBeRemoved(() => queryAllByRole('alert'), {
      timeout: 2000,
    });
  });
});
