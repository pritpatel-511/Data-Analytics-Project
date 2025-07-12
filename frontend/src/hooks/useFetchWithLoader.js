// src/hooks/useFetchWithLoader.js
import { useLoader } from "../context/LoaderContext";

export default function useFetchWithLoader() {
  const loaderContext = useLoader();

  if (!loaderContext || typeof loaderContext.showLoader !== "function" || typeof loaderContext.hideLoader !== "function") {
    console.error("Loader context is not properly initialized.");
    return async function fetchWithLoader(url, options = {}) {
      return await fetch(url, options); // fallback
    };
  }

  const { showLoader, hideLoader } = loaderContext;

  return async function fetchWithLoader(url, options = {}) {
    try {
      showLoader();
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      throw error;
    } finally {
      hideLoader();
    }
  };
}
