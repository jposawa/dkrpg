import React from "react";
import { notification } from "antd";
import { NotificationPlacement } from "antd/es/notification/interface";

type ToastTypes = "info" | "success" | "warning" | "error" | "open";

export const useAntToast = () => {
	const openToast = React.useCallback(
		(
      title: string,
			text?: string,
			type: ToastTypes = "info",
      position?: NotificationPlacement,
			customClass?: string,
      onClose?: () => void,
		) => {
			/**
			 * @param {string}: The title of toast
			 * @param {string}: (Optional) Some additional text if you want
			 * @param {ToastTypes}: (Optional) Set the pre defined style according to the type. Use a default otherwise
			 * @param {string}: (Optional) Pass a custom class if you want more customization. Be mindful of using this
       * @param {Function}: onClose
			 */
			notification[type]({
				message: title,
				description: text,
				className: customClass,
        placement: position,
        onClose: onClose,
			});
		},
		[notification]
	);

	return React.useMemo(
		() => ({ openToast }),
		[openToast]
	);
};
