package com.xu_qiyi.animehub

import android.content.Context
import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.activity.enableEdgeToEdge
import androidx.core.view.WindowCompat

class MainActivity : TauriActivity() {

  companion object {
    private const val TAG = "StatusBarBridge"
    private const val PREFS_NAME = "animehub-statusbar"
    private const val KEY_THEME = "theme"
  }

  private var currentTheme = "dark"

  override fun onCreate(savedInstanceState: Bundle?) {
    enableEdgeToEdge()
    super.onCreate(savedInstanceState)
    val saved = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
      .getString(KEY_THEME, "dark") ?: "dark"
    currentTheme = saved
    Log.d(TAG, "onCreate: saved theme=$saved")
  }

  override fun onResume() {
    super.onResume()
    Log.d(TAG, "onResume: applying theme=$currentTheme")
    applyStatusBarStyle(currentTheme == "dark")
  }

  override fun onWebViewCreate(webView: WebView) {
    super.onWebViewCreate(webView)
    Log.d(TAG, "onWebViewCreate: registering JS bridge")
    webView.addJavascriptInterface(StatusBarBridge(), "StatusBarBridge")
  }

  private fun applyStatusBarStyle(dark: Boolean) {
    val window = this.window
    WindowCompat.setDecorFitsSystemWindows(window, false)
    val controller = WindowCompat.getInsetsController(window, window.decorView)

    if (dark) {
      window.statusBarColor = Color.parseColor("#0a0a0a")
      window.navigationBarColor = Color.parseColor("#0a0a0a")
    } else {
      window.statusBarColor = Color.parseColor("#ffffff")
      window.navigationBarColor = Color.parseColor("#ffffff")
    }
    controller.isAppearanceLightStatusBars = !dark
    controller.isAppearanceLightNavigationBars = !dark
    Log.d(TAG, "applyStatusBarStyle: dark=$dark, statusBarColor=${if (dark) "#0a0a0a" else "#ffffff"}")
  }

  inner class StatusBarBridge {
    @JavascriptInterface
    fun setStatusBarStyle(dark: Boolean) {
      Log.d(TAG, "JS bridge called: dark=$dark")
      currentTheme = if (dark) "dark" else "light"
      getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        .edit().putString(KEY_THEME, currentTheme).apply()
      runOnUiThread { applyStatusBarStyle(dark) }
    }
  }
}
