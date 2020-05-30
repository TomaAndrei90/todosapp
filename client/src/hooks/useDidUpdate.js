import { useRef, useEffect } from 'react';

const useDidUpdate = (callback, dependencies) => {
	const hasMount = useRef(false);

	useEffect(() => {
		if (hasMount.current) {
			callback();
		} else {
			hasMount.current = true;
		}
	}, dependencies);
};

export default useDidUpdate;