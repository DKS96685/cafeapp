'use client';

export default function CanvasPlaceholder() {
    return (
        <div className="canvas-container" style={{ width: '100%', height: '100%', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <iframe 
                src="https://my.spline.design/foodiescopy-ntDWLuFMI8GBVuaeYo5ZhTVz/" 
                frameBorder="0" 
                width="100%" 
                height="100%" 
                style={{ minHeight: '400px', border: 'none' }}
                title="3D Cafe Scene"
            />
        </div>
    );
}
