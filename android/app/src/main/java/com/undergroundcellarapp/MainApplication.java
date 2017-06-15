package com.undergroundcellarapp;

import android.app.Application;
import android.content.Intent;

import com.cardio.RNCardIOPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactApplication;
import com.cmcewen.blurview.BlurViewPackage;
import io.moori.rnshareactions.RNShareActionsPackage;
import com.beefe.picker.PickerViewPackage;
import com.wheelpicker.WheelPickerPackage;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.oblador.vectoricons.VectorIconsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  CallbackManager mCallbackManager;

  static MainApplication instance;
  public static MainApplication getInstance() {
    return instance;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      mCallbackManager = new CallbackManager.Factory().create();
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new BlurViewPackage(),
            new RNShareActionsPackage(),
            new PickerViewPackage(),
            new WheelPickerPackage(),
            new CodePush(null, getApplicationContext(), BuildConfig.DEBUG),
            new RNCardIOPackage(),
            new VectorIconsPackage(),
              new FBSDKPackage(mCallbackManager),
            new ReactNativePushNotificationPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    instance = this;
    SoLoader.init(this, /* native exopackage */ false);
    FacebookSdk.sdkInitialize(getApplicationContext());
    AppEventsLogger.activateApp(this);
  }

  public CallbackManager getCallbackManager() {
    return mCallbackManager;
  }
}
