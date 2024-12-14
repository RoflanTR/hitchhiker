interface Response {
  success: boolean;
  message: string;
}

type NotifyFunction = (options: {
  message: string;
  color: string;
  icon: string;
  textColor: string;
}) => void;

export function alarm(res: Response, notify: NotifyFunction) {
  if (res.success) {
    notify({
      message: res.message,
      color: 'positive',
      icon: 'check_circle_outline',
      textColor: 'white',
    });
  } else {
    notify({
      message: res.message,
      color: 'negative',
      icon: 'error',
      textColor: 'white',
    });
  }
}
