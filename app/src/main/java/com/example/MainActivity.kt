package com.example

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.viewinterop.AndroidView
import androidx.lifecycle.lifecycleScope
import com.example.ui.theme.MyApplicationTheme
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    private var webViewInstance: WebView? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                Scaffold(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color(0xFF0B1020))
                ) { innerPadding ->
                    // Set up local navigation behavior handling the Android back button inside WebView
                    val parentPadding = innerPadding
                    AppWebViewContainer(
                        activity = this@MainActivity,
                        onWebViewCreated = { webView ->
                            webViewInstance = webView
                        }
                    )
                }
            }
        }
    }
}

@SuppressLint("SetJavaScriptEnabled", "JavascriptInterface")
@Composable
fun AppWebViewContainer(
    activity: MainActivity,
    onWebViewCreated: (WebView) -> Unit
) {
    val darkBgColor = remember { Color(0xFF0B1020) }

    // Intercept back button presses and navigate the WebView back if possible
    var webViewRef: WebView? = null
    BackHandler(enabled = true) {
        webViewRef?.let {
            if (it.canGoBack()) {
                it.goBack()
            } else {
                activity.finish()
            }
        } ?: activity.finish()
    }

    AndroidView(
        modifier = Modifier
            .fillMaxSize()
            .background(darkBgColor)
            .statusBarsPadding()
            .navigationBarsPadding()
            .imePadding(),
        factory = { context ->
            WebView(context).apply {
                webViewRef = this
                onWebViewCreated(this)
                
                // Style layout background
                setBackgroundColor(darkBgColor.toArgb())
                
                settings.apply {
                    javaScriptEnabled = true
                    domStorageEnabled = true
                    databaseEnabled = true
                    allowFileAccess = true
                    allowContentAccess = true
                    
                    // Essential settings for WebViews loading relative physical asset pages securely
                    allowFileAccessFromFileURLs = true
                    allowUniversalAccessFromFileURLs = true
                    
                    mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                    useWideViewPort = true
                    loadWithOverviewMode = true
                    cacheMode = WebSettings.LOAD_DEFAULT
                }

                webChromeClient = object : WebChromeClient() {}
                webViewClient = object : WebViewClient() {
                    override fun shouldOverrideUrlLoading(
                        view: WebView?,
                        request: WebResourceRequest?
                    ): Boolean {
                        val url = request?.url?.toString() ?: ""
                        if (url.startsWith("file://") || url.startsWith("http://localhost")) {
                            return false
                        }
                        // Allow external links like github.com, firebase.google.com to open naturally
                        return false
                    }
                }

                // Add Gemini Bridge
                addJavascriptInterface(GeminiBridge(this, activity), "GeminiBridge")

                // Load initial index.html
                loadUrl("file:///android_asset/termuxhub/index.html")
            }
        },
        update = { webView ->
            webViewRef = webView
        }
    )
}

class GeminiBridge(private val webView: WebView, private val activity: MainActivity) {
    @JavascriptInterface
    fun askGemini(prompt: String, useSearch: Boolean, callbackId: String) {
        activity.lifecycleScope.launch {
            val systemInstruction = "You are TermuxHub's intelligent assistant, a professional CLI, Linux terminal, open-source tool, and safe coding expert. Help users with Termux setups, explain bash/utility scripts, troubleshoot errors, and maintain strict tutorial/educational boundaries. Do not provide exploits or write harmful payloads. Prioritize clear, minimalist Markdown formatting suitable for a terminal-styled app UI."
            // Run on background thread
            val result = GeminiService.generateContent(
                prompt = prompt,
                systemInstruction = systemInstruction,
                useSearch = useSearch
            )
            val escapedResult = escapeJsonString(result)
            
            // Dispatch back to UI thread
            webView.post {
                webView.evaluateJavascript(
                    "javascript:window.onGeminiResponse('$callbackId', \"$escapedResult\", null)",
                    null
                )
            }
        }
    }

    private fun escapeJsonString(str: String): String {
        return str.replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t")
            .replace("\u2028", "\\u2028")
            .replace("\u2029", "\\u2029")
    }
}
