import { useQuasar } from 'quasar';

export function useNotify() {
  const $q = useQuasar();

  function notify({
    message = 'default',
    color = 'positive',
    icon = 'check_circle_outline',
    progress = true,
    textColor = 'white',
  }) {
    $q.notify({
      progress,
      message,
      icon,
      color,
      textColor,
    });
  }

  return {
    notify,
  };
}
