#Specifies not to ignore non-public library classes. As of version 4.5, this is the default setting
-dontskipnonpubliclibraryclasses
#!code/simplification/arithmetic,!field/*,!class/merging/*
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*

#-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification
-dontpreverify
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses
#Specifies to write out some more information during processing. If the program terminates with an exception, this option will print out the entire stack trace, instead of just the exception message.
-verbose

-dontwarn com.j256.ormlite.**
-dontwarn com.amazonaws.**
-dontwarn android.support.v7.**
-dontwarn android.support.v4.**
-dontwarn com.google.android.gms.**
-dontwarn com.koushikdutta.**
-dontwarn com.googlecode.**
-dontwarn android.support.design.**
-dontwarn io.branch.**
-dontwarn com.cloudinary.**
-dontnote android.support.**
-dontwarn android.support.**
-dontwarn com.rey.material.**
-dontwarn com.chauthai.swipereveallayout.**
#Retrofit
# Platform calls Class.forName on types which do not exist on Android to determine platform.
-dontnote retrofit2.Platform
# Platform used when running on Java 8 VMs. Will not be used at runtime.
-dontwarn retrofit2.Platform$Java8
#-dontwarn retrofit2.**
-dontwarn org.codehaus.mojo.**

-dontwarn rx.**
-dontwarn okio.**
-dontwarn com.squareup.okhttp.**
-dontwarn okhttp3.**
#Fresco
-dontwarn javax.annotation.**
-dontwarn com.android.volley.toolbox.**
-dontwarn com.facebook.infer.**

#ChipsLayoutManager
-dontwarn com.beloo.widget.chipslayoutmanager.Orientation

-keepclassmembers class * {
  public <init>(android.content.Context);
}

#Fresco

# Keep our interfaces so they can be used by other ProGuard rules.
# See http://sourceforge.net/p/proguard/bugs/466/
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip

# Do not strip any method/class that is annotated with @DoNotStrip
-keep @com.facebook.common.internal.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.common.internal.DoNotStrip *;
}

# Keep native methods
-keepclassmembers class * {
    native <methods>;
}

# Understand the @Keep support annotation.
-keep class android.support.annotation.Keep

-keep @android.support.annotation.Keep class * {*;}

# Preserve annotated Javascript interface methods.
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

-keepclasseswithmembers class * {
    @android.support.annotation.Keep <fields>;
}

-keepclasseswithmembers class * {
    @android.support.annotation.Keep <init>(...);
}

#ChipsLayoutManager
-keep class com.beloo.widget.chipslayoutmanager.* { *; }
-keep class com.beloo.widget.chipslayoutmanager.** { *; }
-keep class com.beloo.widget.chipslayoutmanager.*$* { *; }
-keep class RestrictTo.*
-keep class RestrictTo.**
-keep class RestrictTo.*$*

# Optimization is turned off by default. Dex does not like code run
# through the ProGuard optimize and preverify steps (and performs some
# of these optimizations on its own).

#Retrofit

-keep class retrofit2.** { *; }
-keepattributes Exceptions

-keepattributes RuntimeVisibleAnnotations
-keepattributes RuntimeInvisibleAnnotations
-keepattributes RuntimeVisibleParameterAnnotations
-keepattributes RuntimeInvisibleParameterAnnotations

-keepattributes EnclosingMethod

-keepclasseswithmembers class * {
    @retrofit2.* <methods>;
}

-keepclasseswithmembers interface * {
    @retrofit2.* <methods>;
}

-keepclassmembers class * {
  public <init>(android.content.Context);
}

-keepclasseswithmembers class * {
    @retrofit2.http.* <methods>;
}
#//Bugsnag
#-renamesourcefileattribute SourceFile
-keepattributes SourceFile,LineNumberTable
-keep class com.bugsnag.android.NativeInterface { *; }
-keep class com.bugsnag.android.Breadcrumbs { *; }
-keep class com.bugsnag.android.Breadcrumbs$Breadcrumb { *; }
-keep class com.bugsnag.android.BreadcrumbType { *; }
-keep class com.bugsnag.android.Severity { *; }
-keep class com.bugsnag.android.ndk.BugsnagObserver { *; }
-keep public class * extends java.lang.Exception

-keepattributes Signature
-keepattributes *Annotation*
-keep class com.squareup.okhttp.** { *; }
-keep class com.cloudinary.** { *; }
-keep interface com.squareup.okhttp.** { *; }
-keep class com.rey.material.** { *; }
-keep class uk.co.chrisjenx.calligraphy.* { *; }
-keep class uk.co.chrisjenx.calligraphy.*$* { *; }
-keep class org.jsoup.**

#-ignorewarnings

-keepclassmembers class ** {
    public void onEvent*(***);
}
-keepclassmembers class ** {
public void onEventMainThread(**);
}

#-keep class com.google.android.gms.ads.identifier.** { *; }

#The -optimizations option disables some arithmetic simplifications that Dalvik 1.0 and 1.5 can't handle. Note that the Dalvik VM also can't handle aggressive overloading (of static fields).
#To understand or change this check http://proguard.sourceforge.net/index.html#/manual/optimizations.html
#-optimizations !code/simplification/arithmetic,!field/*,!class/merging/*

# Note that if you want to enable optimization, you cannot just
# include optimization flags in your own project configuration file;
# instead you will need to point to the
# "proguard-android-optimize.txt" file instead of this one from your
# project.properties file.

#To repackage classes on a single package
#-repackageclasses ''

#Uncomment if using annotations to keep them.
# For using GSON @Expose annotation
-keepattributes *Annotation*

#Keep classes that are referenced on the AndroidManifest
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.app.IntentService
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider
-keep public class * extends android.app.backup.BackupAgentHelper
-keep public class * extends android.preference.Preference
-keep public class com.google.vending.licensing.ILicensingService
-keep public class com.android.vending.licensing.ILicensingService
-keep public class com.google.android.vending.licensing.ILicensingService
-dontnote com.android.vending.licensing.ILicensingService
-dontnote com.google.vending.licensing.ILicensingService
-dontnote com.google.android.vending.licensing.ILicensingService
-keep class com.j256.**
-keepclassmembers class com.j256.** { *; }
-keep enum com.j256.**
-keepclassmembers enum com.j256.** { *; }
-keep interface com.j256.**
-keepclassmembers interface com.j256.** { *; }
# Google Map
#-keep class com.google.android.gms.** { *; }
#-keep interface com.google.android.gms.** { *; }

#-keep class com.googlecode.** { *; }
#-keepnames class com.googlecode.** { *; }
#-keepclassmembers class com.googlecode.** { *; }

#-keep class android.** { *; }
#Compatibility library
-keep public class * extends android.support.v4.app.Fragment
-keep public class * extends android.app.Fragment

#-keep class android.support.v4.app.** { *; }
#-keep interface android.support.v4.app.** { *; }
#-keep class android.support.v7.** { *; }


#To maintain custom components names that are used on layouts XML.
#Uncomment if having any problem with the approach below
#-keep public class custom.components.package.and.name.**

# keep setters in Views so that animations can still work.
# see http://proguard.sourceforge.net/manual/examples.html#beans
 -keepclassmembers public class * extends android.view.View {
  void set*(***);
  *** get*();
}


#To remove debug logs:
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** w(...);
}

#To avoid changing names of methods invoked on layout's onClick.
# Uncomment and add specific method names if using onClick on layouts
#-keepclassmembers class * {
# public void onClickButton(android.view.View);
#}

#Maintain java native methods
-keepclasseswithmembernames class * {
    native <methods>;
}


#To maintain custom components names that are used on layouts XML:
-keep public class * extends android.view.View {
    public <init>(android.content.Context);
}
-keep public class * extends android.view.View {
    public <init>(android.content.Context, android.util.AttributeSet);
}
-keep public class * extends android.view.View {
    public <init>(android.content.Context, android.util.AttributeSet, int);
}

-keep public class com.google.gson.**

#Maintain enums
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

-keepclassmembers class * implements android.os.Parcelable {
    public static final ** CREATOR;
}

#To keep parcelable classes (to serialize - deserialize objects to sent through Intents)
-keep class * implements android.os.Parcelable {
  public static final android.os.Parcelable$Creator *;
}

#Keep the R
-keepclassmembers class **.R$* {
    public static <fields>;
}

###### ADDITIONAL OPTIONS NOT USED NORMALLY

#To keep callback calls. Uncomment if using any
#http://proguard.sourceforge.net/index.html#/manual/examples.html#callback
#-keep class mypackage.MyCallbackClass {
#   void myCallbackMethod(java.lang.String);
#}


# Gson specific classes
-keep class sun.misc.Unsafe { *; }
#-keep class com.google.gson.stream.** { *; }

# Application classes that will be serialized/deserialized over Gson
-keep class com.barandbench.barandbench_poc.model.** { *; }


#Uncomment if using Serializable
-keepclassmembers class * implements java.io.Serializable {
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}