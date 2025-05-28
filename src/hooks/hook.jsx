import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
import { toast } from "react-toastify";

const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) fallback();
        else toast.error(error?.data?.message || "Something went wrong");
      }
    });
  }, [errors]);
};
// //?
// const useAsyncMutation = (mutationHook) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [data, setData] = useState(null);

//   const [mutate] = mutationHook();

//   const executeMutation = async (toastMessage, ...args) => {
//     setIsLoading(true);
//     const toastId = toast.loading(toastMessage || "Updating data...");

//     try {
//       const res = await mutate(...args);

//       if (res.data) {
//         toast.update(toastId, {
//           render: res.data.message || "Updated data successfully",
//           type: "success",
//           isLoading: false,
//           autoClose: 3000,
//         });
//         setData(res.data);
//       } else {
//         toast.update(toastId, {
//           render: res?.error?.data?.message || "Something went wrong",
//           type: "error",
//           isLoading: false,
//           autoClose: 3000,
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       toast.update(toastId, {
//         render: "Something went wrong",
//         type: "error",
//         isLoading: false,
//         autoClose: 3000,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return [executeMutation, isLoading, data];
// };
const useAsyncMutation = (mutationHook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  const [mutate] = mutationHook();

  const executeMutation = async (toastMessage, ...args) => {
    setIsLoading(true);
    const toastId = toast.loading(toastMessage || "Updating data...");

    try {
      const res = await mutate(...args);

      if (res.data) {
        toast.update(toastId, {
          render: res.data.message || "Updated data successfully",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setData(res.data);
        return res.data; // ✅ return the actual response
      } else {
        toast.update(toastId, {
          render: res?.error?.data?.message || "Something went wrong",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return null;
      }
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render: "Something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return [executeMutation, isLoading, data];
};

const useSocketEvents = (socket, handlers) => {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, handlers]);
};

export { useErrors, useAsyncMutation, useSocketEvents };
