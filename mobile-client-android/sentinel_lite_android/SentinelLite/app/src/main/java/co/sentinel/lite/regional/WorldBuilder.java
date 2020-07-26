package co.sentinel.lite.regional;

/*
 * Copyright (c) 2019 Bernard Che Longho (blongho02@gmail.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
/**
 * @file WorldBuilder.java
 * @author Bernard Che Longho (blongho02@gmail.com)
 *   <br> A class to load all the flags and countries in a map
 *   <br> This eases the access of flag when the country
 *   alpha2 or alpha3  or the numeric codes are known<br> This class is accessible only to the package
 * @since 2019-05-10
 */

import android.app.Application;
import android.support.annotation.AnyThread;
import android.support.annotation.DrawableRes;
import android.support.annotation.NonNull;

import co.sentinel.lite.R;

import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 *  The WorldBuilder reads everything from the assets and prepares them for the World
 */
final class WorldBuilder {
    private final static String countryFile = "co.sentinel.sentinellite.regional.countries.json";
    private final static String country_extras = "co.sentinel.sentinellite.regional.countries_extras.json";
    static int globe = R.drawable.ic_filter; // The image of the globe
    private static ArrayList<co.sentinel.lite.regional.Country> countryAndFlag = new ArrayList<>(); //  {Country + flag + currency}
    private static Map<String, Integer> flagMap = new ConcurrentHashMap<>(); // {alpha2, mapImage}
    private static co.sentinel.lite.regional.Country[] countries; // sets its value in loadCountries()
    private static Map<String, co.sentinel.lite.regional.CountryExtras> countryExtrasMap = new ConcurrentHashMap<>();
    private static volatile co.sentinel.lite.regional.WorldBuilder instance;
    private Application context; // The application context

    private WorldBuilder(Application ctx) {
        context = ctx;
        loadCountries();
    }

    /**
     * Read all countries from file
     */
    private void loadCountries() {
        loadCountryExtras();
        final String values = co.sentinel.lite.regional.AssetsReader.readFromAssets(context, countryFile);
        Gson         gson   = new Gson();
        countries = gson.fromJson(values, co.sentinel.lite.regional.Country[].class);
        addOtherCountryProperties();
    }

    /**
     * Load the currencies from com.blongho.country_data.currencies.json
     */

    /**
     * Load the extra information about a country
     */
    private void loadCountryExtras() {
        final String  country_extra = co.sentinel.lite.regional.AssetsReader.readFromAssets(context, country_extras);
        Gson            gson          = new Gson();
        co.sentinel.lite.regional.CountryExtras[] countryExtras = gson.fromJson(country_extra, co.sentinel.lite.regional.CountryExtras[].class);
        for (co.sentinel.lite.regional.CountryExtras extra : countryExtras) {
            countryExtrasMap.put(extra.getAlpha2().toLowerCase(), extra);
        }
    }

    /**
     * Load the countries and their flags in a Map container
     * <br>
     * Each country is flag is mapped with the country alpha2 and alpha3 codes
     */
    private void addOtherCountryProperties() {
        for (final co.sentinel.lite.regional.Country country : countries) {
            final String resource = "drawable/" + country.getAlpha2().toLowerCase();

            final int countryFlag = country.getAlpha2().equalsIgnoreCase("do") ? globe :
                    context.getResources().getIdentifier(resource, null, context.getPackageName());

            country.setFlagResource(countryFlag);
            country.setExtras(countryExtrasMap.get(country.getAlpha2().toLowerCase()));
            addFlag(country, countryFlag);
            countryAndFlag.add(country);

        }
        flagMap.put("globe", R.drawable.ic_filter);
    }

    /**
     * Add another country flag to the list of flags
     *
     * @param country The country for which the flag is to be added
     * @param imageResource the image resource <br> This should be a drawable resource
     */
    private static void addFlag(@NonNull final co.sentinel.lite.regional.Country country, @DrawableRes @NonNull final Integer imageResource) {
        flagMap.put(country.getAlpha2().toLowerCase(), imageResource);
        flagMap.put(country.getName().toLowerCase(), imageResource);
        flagMap.put(country.getId(), imageResource);
        flagMap.put(country.getAlpha3().toLowerCase(), imageResource);
    }

    /**
     * Get an instance of this class<br> This is a thread-safe singleton of the class. <br> Once called, all the flag
     * resources are loaded and all countries are assigned their flags. Calling this more than once has not benefit.
     *
     * @param ctx The application context (getApplicationContext())
     *
     * @return An instance of this class
     */
    @AnyThread
    static co.sentinel.lite.regional.WorldBuilder getInstance(Application ctx) {
        if (instance == null) {
            synchronized (co.sentinel.lite.regional.WorldBuilder.class) {
                if (instance == null) {
                    instance = new co.sentinel.lite.regional.WorldBuilder(ctx);
                }
            }
        }
        return instance;
    }

    /**
     * Return gibberish instead of null as a Country
     *
     * @return demo Country with name Earth
     */
    static co.sentinel.lite.regional.Country demoCountry() {
        co.sentinel.lite.regional.Country demo = new co.sentinel.lite.regional.Country("999", "Earth", "_e", "_ee");
        demo.setFlagResource(globe);
        demo.setExtras(new co.sentinel.lite.regional.CountryExtras("_e", "equator", "0", "0", "globe"));
        return demo;
    }

    /**
     * Get the countries with their flags loaded
     *
     * @return An unmodifiable uArrayList with all countries and their flags or empty list
     */
    @AnyThread
    static List<co.sentinel.lite.regional.Country> allCountriesAndFlags() {
        return instance != null && !countryAndFlag.isEmpty() ? Collections.unmodifiableList(countryAndFlag) :
                Collections.<Country>emptyList();
    }

    /**
     * Get the map with flags and their country attributes
     *
     * @return an unmodifiable Map<countryIdentifier, mapID> <br> or an empty map if the getInstance() has not been
     *   called  or if the flagMap is empty
     */
    static Map<String, Integer> getFlagMap() {
        return instance != null && !flagMap.isEmpty() ? Collections.unmodifiableMap(flagMap) :
                Collections.<String, Integer>emptyMap();
    }

    /**
     * Get the currency map
     *
     * @return Get the list of currencies
     */
    static Map<String, co.sentinel.lite.regional.CountryExtras> getCountryExtras() {
        return countryExtrasMap;
    }
}
