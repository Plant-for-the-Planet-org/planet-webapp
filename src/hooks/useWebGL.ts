import { useState, useEffect } from 'react';

interface WebGLSupport {
  isWebglSupported: boolean | null;
  error: string | null;
  loading: boolean;
}

export const useWebGL = (): WebGLSupport => {
  const [isWebglSupported, setIsWebglSupported] = useState<boolean | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const detectWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        // MapLibre GL JS v5+ renders through WebGL2 only. Probing WebGL1 here would
        // pass browsers where the map then throws GPUInitializationError on construction.
        const gl = canvas.getContext('webgl2');

        if (!gl) {
          setIsWebglSupported(false);
          setError('WebGL2 context could not be created');
        } else {
          // Additional check for working WebGL
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          const renderer = debugInfo
            ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            : '';

          // Check for SwiftShader (software renderer) which might fail for complex maps
          if (
            typeof renderer === 'string' &&
            renderer.includes('SwiftShader')
          ) {
            setIsWebglSupported(false);
            setError(
              'Software rendering detected - hardware acceleration required'
            );
          } else {
            setIsWebglSupported(true);
          }
        }
      } catch (e) {
        setIsWebglSupported(false);
        setError(e instanceof Error ? e.message : 'Unknown WebGL error');
      } finally {
        setLoading(false);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(detectWebGL, 100);
    return () => clearTimeout(timer);
  }, []);

  return { isWebglSupported, error, loading };
};
