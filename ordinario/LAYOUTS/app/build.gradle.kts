plugins { id("com.android.application") }
android {
    namespace = "com.example.layoutspropios"
    compileSdk { version = release(37) }
    defaultConfig {
        applicationId = "com.example.layoutspropios"
        minSdk = 24
        targetSdk = 37
        versionCode = 1
        versionName = "1.0"
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}
dependencies {
    implementation("androidx.appcompat:appcompat:1.7.1")
    implementation("com.google.android.material:material:1.13.0")
}
