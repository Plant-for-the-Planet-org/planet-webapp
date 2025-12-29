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
        const gl =
          canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!gl || !(gl instanceof WebGLRenderingContext)) {
          setIsWebglSupported(false);
          setError('WebGL context could not be created');
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
