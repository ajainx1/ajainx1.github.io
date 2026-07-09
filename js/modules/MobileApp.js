import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export async function initMobile() {
    if (!Capacitor.isNativePlatform()) return;
    
    try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setOverlaysWebView({ overlay: true });
        
        // Hide splash screen after our custom boot sequence is done, 
        // or just hide it immediately so our custom boot takes over.
        await SplashScreen.hide();
    } catch (e) {
        console.warn('Native plugins failed', e);
    }
}

export async function triggerHaptic(style = ImpactStyle.Light) {
    if (Capacitor.isNativePlatform()) {
        try {
            await Haptics.impact({ style });
        } catch (e) {
            console.warn('Haptics failed', e);
        }
    }
}

// Make it available globally for inline scripts (like onclick handlers)
window.triggerHaptic = triggerHaptic;
window.ImpactStyle = ImpactStyle;

// Initialize automatically
initMobile();
