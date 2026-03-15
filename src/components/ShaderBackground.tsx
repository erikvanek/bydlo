import { useEffect, useRef } from 'react'

const VERT_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAG_SRC = `
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  float w1 = sin(uv.x * 10.0 + u_time * 0.6) * 0.5 + 0.5;
  float w2 = sin(uv.y * 7.0 - u_time * 0.4 + 1.5) * 0.5 + 0.5;
  float w3 = sin((uv.x + uv.y) * 5.0 + u_time * 0.8) * 0.5 + 0.5;
  float w4 = sin(length(uv - 0.5) * 12.0 - u_time * 1.2) * 0.5 + 0.5;

  float p = w1 * 0.3 + w2 * 0.25 + w3 * 0.25 + w4 * 0.2;

  vec3 dark   = vec3(0.04, 0.22, 0.04);
  vec3 mid    = vec3(0.13, 0.60, 0.08);
  vec3 bright = vec3(0.45, 1.00, 0.10);

  vec3 color = mix(dark, mix(mid, bright, p), p);
  gl_FragColor = vec4(color, 1.0);
}
`

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  return shader
}

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl')
    if (!gl) return

    const vert = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC)
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC)
    const program = gl.createProgram()!
    gl.attachShader(program, vert)
    gl.attachShader(program, frag)
    gl.linkProgram(program)
    gl.useProgram(program)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    )

    const posLoc = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    const timeLoc = gl.getUniformLocation(program, 'u_time')
    const resLoc = gl.getUniformLocation(program, 'u_resolution')

    let rafId: number
    const start = performance.now()

    function resize() {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      gl!.viewport(0, 0, canvas!.width, canvas!.height)
    }

    resize()
    window.addEventListener('resize', resize)

    function render() {
      const t = (performance.now() - start) / 1000
      gl!.uniform1f(timeLoc, t)
      gl!.uniform2f(resLoc, canvas!.width, canvas!.height)
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4)
      rafId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        display: 'block',
      }}
    />
  )
}
