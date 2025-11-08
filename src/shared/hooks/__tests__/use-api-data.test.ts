import { renderHook, waitFor } from "@testing-library/react";
import { useApiData } from "../use-api-data";

describe("useApiData", () => {
  describe("Initial state", () => {
    it("should initialize with null data", () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1 });
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );
      expect(result.current.data).toBeNull();
    });

    it("should initialize with loading false", () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1 });
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );
      expect(result.current.loading).toBe(false);
    });

    it("should initialize with null error", () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1 });
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );
      expect(result.current.error).toBeNull();
    });

    it("should provide refetch function", () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1 });
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );
      expect(result.current.refetch).toBeDefined();
      expect(typeof result.current.refetch).toBe("function");
    });

    it("should return all expected properties", () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1 });
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );
      expect(result.current).toHaveProperty("data");
      expect(result.current).toHaveProperty("loading");
      expect(result.current).toHaveProperty("error");
      expect(result.current).toHaveProperty("refetch");
    });
  });

  describe("Initial load", () => {
    it("should fetch data on mount when initialLoad is true", async () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1, name: "Test" });
      const { result } = renderHook(() => useApiData({ fetcher, initialLoad: true }));

      await waitFor(() => {
        expect(result.current.data).toEqual({ id: 1, name: "Test" });
      });
    });

    it("should call fetcher on mount with initialLoad true", async () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1 });
      renderHook(() => useApiData({ fetcher, initialLoad: true }));

      await waitFor(() => {
        expect(fetcher).toHaveBeenCalledTimes(1);
      });
    });

    it("should not fetch data when initialLoad is false", async () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1 });
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await waitFor(() => {
        expect(fetcher).not.toHaveBeenCalled();
      });
      expect(result.current.data).toBeNull();
    });

    it("should default initialLoad to true", async () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1 });
      renderHook(() => useApiData({ fetcher }));

      await waitFor(() => {
        expect(fetcher).toHaveBeenCalledTimes(1);
      });
    });

    it("should set loading true during initial fetch", async () => {
      const fetcher = jest.fn(
        () => new Promise((resolve) => setTimeout(() => resolve({ id: 1 }), 100))
      );
      const { result } = renderHook(() => useApiData({ fetcher, initialLoad: true }));

      expect(result.current.loading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe("Loading state", () => {
    it("should set loading to true when fetching", async () => {
      const fetcher = jest.fn(
        () => new Promise((resolve) => setTimeout(() => resolve({ id: 1 }), 100))
      );
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      result.current.refetch();
      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });
    });

    it("should set loading to false after successful fetch", async () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1 });
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it("should set loading to false after error", async () => {
      const fetcher = jest.fn().mockRejectedValue(new Error("Fetch error"));
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it("should maintain loading state consistency", async () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1 });
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      expect(result.current.loading).toBe(false);
      
      result.current.refetch();
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe("Success handling", () => {
    it("should set data on successful fetch", async () => {
      const mockData = { id: 1, name: "Test", value: 42 };
      const fetcher = jest.fn().mockResolvedValue(mockData);
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });
    });

    it("should clear error on successful fetch", async () => {
      const fetcher = jest
        .fn()
        .mockRejectedValueOnce(new Error("First error"))
        .mockResolvedValueOnce({ id: 1 });
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();
      await waitFor(() => expect(result.current.error).toBeTruthy());

      await result.current.refetch();
      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });

    it("should update data on multiple successful fetches", async () => {
      const fetcher = jest
        .fn()
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce({ id: 2 });
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();
      await waitFor(() => expect(result.current.data).toEqual({ id: 1 }));

      await result.current.refetch();
      await waitFor(() => {
        expect(result.current.data).toEqual({ id: 2 });
      });
    });

    it("should handle array data", async () => {
      const mockArray = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const fetcher = jest.fn().mockResolvedValue(mockArray);
      const { result } = renderHook(() =>
        useApiData<typeof mockArray>({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toEqual(mockArray);
      });
    });

    it("should handle string data", async () => {
      const fetcher = jest.fn().mockResolvedValue("success");
      const { result } = renderHook(() =>
        useApiData<string>({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toBe("success");
      });
    });

    it("should handle number data", async () => {
      const fetcher = jest.fn().mockResolvedValue(42);
      const { result } = renderHook(() =>
        useApiData<number>({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toBe(42);
      });
    });

    it("should handle boolean data", async () => {
      const fetcher = jest.fn().mockResolvedValue(true);
      const { result } = renderHook(() =>
        useApiData<boolean>({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toBe(true);
      });
    });
  });

  describe("Error handling", () => {
    it("should set error message on fetch failure", async () => {
      const fetcher = jest.fn().mockRejectedValue(new Error("Fetch failed"));
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.error).toBe("Fetch failed");
      });
    });

    it("should keep data null on error", async () => {
      const fetcher = jest.fn().mockRejectedValue(new Error("Error"));
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toBeNull();
      });
    });

    it("should handle non-Error objects", async () => {
      const fetcher = jest.fn().mockRejectedValue("String error");
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.error).toBe("Unknown error");
      });
    });

    it("should handle null rejection", async () => {
      const fetcher = jest.fn().mockRejectedValue(null);
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.error).toBe("Unknown error");
      });
    });

    it("should handle undefined rejection", async () => {
      const fetcher = jest.fn().mockRejectedValue(undefined);
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.error).toBe("Unknown error");
      });
    });

    it("should preserve previous data on error", async () => {
      const fetcher = jest
        .fn()
        .mockResolvedValueOnce({ id: 1 })
        .mockRejectedValueOnce(new Error("Error"));
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();
      await waitFor(() => expect(result.current.data).toEqual({ id: 1 }));

      await result.current.refetch();
      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
        expect(result.current.data).toEqual({ id: 1 });
      });
    });
  });

  describe("Refetch functionality", () => {
    it("should refetch data when refetch is called", async () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1 });
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(fetcher).toHaveBeenCalledTimes(1);
      });
    });

    it("should allow multiple refetches", async () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1 });
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();
      await result.current.refetch();
      await result.current.refetch();

      await waitFor(() => {
        expect(fetcher).toHaveBeenCalledTimes(3);
      });
    });

    it("should return a promise from refetch", async () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1 });
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      const promise = result.current.refetch();
      expect(promise).toBeInstanceOf(Promise);
      await promise;
    });

    it("should update data on refetch", async () => {
      const fetcher = jest
        .fn()
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce({ id: 2 });
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();
      await waitFor(() => expect(result.current.data).toEqual({ id: 1 }));

      await result.current.refetch();
      await waitFor(() => {
        expect(result.current.data).toEqual({ id: 2 });
      });
    });

    it("should handle refetch after error", async () => {
      const fetcher = jest
        .fn()
        .mockRejectedValueOnce(new Error("Error"))
        .mockResolvedValueOnce({ id: 1 });
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();
      await waitFor(() => expect(result.current.error).toBeTruthy());

      await result.current.refetch();
      await waitFor(() => {
        expect(result.current.error).toBeNull();
        expect(result.current.data).toEqual({ id: 1 });
      });
    });
  });

  describe("useCallback memoization", () => {
    it("should maintain stable refetch function", () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1 });
      const { result, rerender } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      const refetch1 = result.current.refetch;
      rerender();
      const refetch2 = result.current.refetch;

      expect(refetch1).toBe(refetch2);
    });

    it("should update refetch when fetcher changes", async () => {
      const fetcher1 = jest.fn().mockResolvedValue({ id: 1 });
      const fetcher2 = jest.fn().mockResolvedValue({ id: 2 });
      
      const { result, rerender } = renderHook(
        ({ fetcher }) => useApiData({ fetcher, initialLoad: false }),
        { initialProps: { fetcher: fetcher1 } }
      );

      await result.current.refetch();
      await waitFor(() => expect(result.current.data).toEqual({ id: 1 }));

      rerender({ fetcher: fetcher2 });
      await result.current.refetch();
      
      await waitFor(() => {
        expect(result.current.data).toEqual({ id: 2 });
      });
    });
  });

  describe("useEffect dependencies", () => {
    it("should refetch when initialLoad changes to true", async () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1 });
      const { result, rerender } = renderHook(
        ({ initialLoad }) => useApiData({ fetcher, initialLoad }),
        { initialProps: { initialLoad: false } }
      );

      expect(fetcher).not.toHaveBeenCalled();

      rerender({ initialLoad: true });

      await waitFor(() => {
        expect(fetcher).toHaveBeenCalledTimes(1);
      });
    });

    it("should not refetch when initialLoad remains false", async () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1 });
      const { rerender } = renderHook(
        ({ initialLoad }) => useApiData({ fetcher, initialLoad }),
        { initialProps: { initialLoad: false } }
      );

      rerender({ initialLoad: false });
      rerender({ initialLoad: false });

      await waitFor(() => {
        expect(fetcher).not.toHaveBeenCalled();
      });
    });
  });

  describe("TypeScript generics", () => {
    it("should work with custom interface", async () => {
      interface CustomData {
        id: number;
        title: string;
        active: boolean;
      }
      const mockData: CustomData = { id: 1, title: "Test", active: true };
      const fetcher = jest.fn().mockResolvedValue(mockData);
      const { result } = renderHook(() =>
        useApiData<CustomData>({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });
    });

    it("should work with nested objects", async () => {
      interface NestedData {
        user: {
          id: number;
          profile: {
            name: string;
          };
        };
      }
      const mockData: NestedData = {
        user: { id: 1, profile: { name: "John" } },
      };
      const fetcher = jest.fn().mockResolvedValue(mockData);
      const { result } = renderHook(() =>
        useApiData<NestedData>({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });
    });

    it("should work with union types", async () => {
      type UnionData = { type: "success"; value: number } | { type: "error"; message: string };
      const mockData: UnionData = { type: "success", value: 42 };
      const fetcher = jest.fn().mockResolvedValue(mockData);
      const { result } = renderHook(() =>
        useApiData<UnionData>({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle empty object data", async () => {
      const fetcher = jest.fn().mockResolvedValue({});
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toEqual({});
      });
    });

    it("should handle empty array data", async () => {
      const fetcher = jest.fn().mockResolvedValue([]);
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toEqual([]);
      });
    });

    it("should handle very large data", async () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => ({ id: i }));
      const fetcher = jest.fn().mockResolvedValue(largeArray);
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toEqual(largeArray);
      });
    });

    it("should handle rapid refetches", async () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1 });
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      result.current.refetch();
      result.current.refetch();
      result.current.refetch();

      await waitFor(() => {
        expect(fetcher).toHaveBeenCalled();
      });
    });

    it("should handle null fetcher result", async () => {
      const fetcher = jest.fn().mockResolvedValue(null);
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toBeNull();
      });
    });
  });

  describe("State consistency", () => {
    it("should reset error when starting new fetch", async () => {
      const fetcher = jest
        .fn()
        .mockRejectedValueOnce(new Error("Error"))
        .mockResolvedValueOnce({ id: 1 });
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();
      await waitFor(() => expect(result.current.error).toBeTruthy());

      result.current.refetch();
      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });

    it("should maintain state consistency during fetch", async () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1 });
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toBeTruthy();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
      });
    });

    it("should maintain state consistency on error", async () => {
      const fetcher = jest.fn().mockRejectedValue(new Error("Error"));
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      await result.current.refetch();

      await waitFor(() => {
        expect(result.current.data).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeTruthy();
      });
    });
  });

  describe("Return value", () => {
    it("should return object with correct shape", () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1 });
      const { result } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      expect(Object.keys(result.current)).toEqual(["data", "loading", "error", "refetch"]);
    });

    it("should return consistent object reference", () => {
      const fetcher = jest.fn().mockResolvedValue({ id: 1 });
      const { result, rerender } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      const keys1 = Object.keys(result.current);
      rerender();
      const keys2 = Object.keys(result.current);

      expect(keys1).toEqual(keys2);
    });
  });

  describe("Cleanup", () => {
    it("should not update state after unmount", async () => {
      const fetcher = jest.fn(
        () => new Promise((resolve) => setTimeout(() => resolve({ id: 1 }), 100))
      );
      const { result, unmount } = renderHook(() =>
        useApiData({ fetcher, initialLoad: false })
      );

      result.current.refetch();
      unmount();

      // Wait to ensure no state updates after unmount
      await new Promise((resolve) => setTimeout(resolve, 150));
      // If no error is thrown, the test passes
    });

    it("should handle unmount during initial load", async () => {
      const fetcher = jest.fn(
        () => new Promise((resolve) => setTimeout(() => resolve({ id: 1 }), 100))
      );
      const { unmount } = renderHook(() =>
        useApiData({ fetcher, initialLoad: true })
      );

      unmount();

      // Wait to ensure no errors after unmount
      await new Promise((resolve) => setTimeout(resolve, 150));
    });
  });
});
