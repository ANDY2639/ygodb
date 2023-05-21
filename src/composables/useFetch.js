import { ref } from "vue";
import config from "@/config";

export default function useFetch(options = {}) {
  const result = ref(null);
  const error = ref(null);
  const loading = ref(false);
  const { signal, abort } = new AbortController();

  loading.value = true;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    // Authorization: ""
  }

  if (options.headers) {
    options.headers = { ...headers, ...options.headers };
  }

  const fetchData = async (file, qs = {}) => {
    try {
      let q = (Object.keys(qs).length > 0) ? `?${new URLSearchParams(qs).toString()}` : '';
      let url = `${config.apiUrl}${file}${q}`;
      
      const res = await fetch(url, {  signal, options });
      if (!res.ok) error.value = "Could not fetch data";

      const response = await res.json();
      const data = ('data' in response) ? response.data : response ;

      result.value = data;
    } catch (err) {
      error.value = err.message;
    }

    loading.value = false;
  }

  return { result, error, loading, abort, fetchData };
}