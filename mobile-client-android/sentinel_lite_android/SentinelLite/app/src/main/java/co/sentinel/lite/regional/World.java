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
 */

import android.app.Application;
import android.content.Context;
import android.support.annotation.NonNull;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * The World knows all the countries and their name, alpha2, alpha3, numeric code and flag. <br> If a country does not
 * exist or is at least not formally recognized, that country will be <br> represented as Earth with flag that of the
 * globe
 *
 * @author Bernard Che Longho (blongho02@gmail.com)
 * @since 2019-05-13 <br>
 *   <br>
 *   The World knows all the countries and their name, alpha2, alpha3, numeric code and flag. <br> If a country does not
 *   exist or is at least not formally recognized, that country will be <br> represented as Earth with flag that of the
 *   globe
 */
public final class World {
    private static final String TAG = "co.sentinel.sentinellite.regional.World".toUpperCase();
    private static List<co.sentinel.lite.regional.Country> allCountries = null;
    private static Map<String, Integer> flagMap = null;
    private static co.sentinel.lite.regional.WorldBuilder instance;

    /**
     * Initialize the world, just as it is today with all its countries and flags
     *
     * @param ctx The context where this object is called (getAppicationContext)
     *
     *   <p><b>Call this once to initialize the data</b></p>
     */
    public static void init(final Application ctx) {
        instance = co.sentinel.lite.regional.WorldBuilder.getInstance(ctx);
        allCountries = co.sentinel.lite.regional.WorldBuilder.allCountriesAndFlags();
        flagMap = co.sentinel.lite.regional.WorldBuilder.getFlagMap();
    }

    /**
     * Get the flag of a country using the numeric code of the country
     * <p>Pre-condition: <br>
     * {@link com.blongho.country_data.World#init(Context)} must have been called, otherwise you get image of globe</p>
     *
     * @param countryCode The numeric code of the country
     *
     * @return An image resource representing the country flag or the image of the globe
     */
    public static int getFlagOf(final int countryCode) {
        return getFlagOf(String.valueOf(countryCode));
    }

    /**
     * Get the flag of a country
     * <p>Pre-condition: <br>
     * {@link co.sentinel.lite.regional.World#init(Context)} must have been called, otherwise you get image of globe</p>
     *
     * @param countryIdentifier the 2  or 3 letter representation of the country
     *   <br> e.g {se|SE|SWE|swe} are all valid entries
     *   for a Swedish flag
     *
     * @return the id of the flag resource or id of globe image if the <br> iso alpha2 or iso alpha3 is not correct or
     *   if  there is no <br> entry in the flag container with that identify.
     *   <p>
     *   Note: If the values are correct and you still do not get the flag, create an issue and this will be
     *   resolved as
     *   soon as possible.
     */
    public static int getFlagOf(@NonNull final String countryIdentifier) {
        if (instance == null) throw new ExceptionInInitializerError(
                TAG + "You need to initialize the library by calling World.init(getApplication) before any other method");
        if (countryIdentifier.isEmpty()) {
            return co.sentinel.lite.regional.WorldBuilder.globe;
        }
        final Integer flag = flagMap.get(countryIdentifier.toLowerCase());
        return flag != null ? flag : co.sentinel.lite.regional.WorldBuilder.globe;
    }

    /**
     * Get the image of the globe directly rather than querying World.getFlagOf("globe")
     * <p>Pre-condition: <br>
     * {@link com.blongho.country_data.World#init(Context)} must have been called, otherwise you get image of globe</p>
     *
     * @return The image of the globe as we know it today
     */
    public static int getWorldFlag() {
        if (instance == null) throw new ExceptionInInitializerError(
                TAG + "You need to initialize the library by calling World.init(getApplication) before any other method");
        return co.sentinel.lite.regional.WorldBuilder.globe;
    }

    /**
     * Get a country from its numeric code
     * <p>Pre-condition: <br>
     * {@link com.blongho.country_data.World#init(Context)} must have been called, otherwise you get a country called Earth</p>
     *
     * @param numericCode The country's numeric code
     *
     * @return A country a country with any of the attributes or a Earth
     */
    public static co.sentinel.lite.regional.Country getCountryFrom(final int numericCode) {
        return getCountryFrom(String.valueOf(numericCode));
    }

    /**
     * Get a country from any of its identifiers
     * <p>Pre-condition: <br>
     * {@link com.blongho.country_data.World#init(Context)} must have been called, otherwise you get a country called Earth</p>
     *
     * @param countryIdentifier The country name, alpha2 or alpha3 values, case insensitive
     *
     * @return A country a country with any of the attributes or a Earth If Pre-condition is not met, an exception is
     *   thrown.
     */
    public static co.sentinel.lite.regional.Country getCountryFrom(final String countryIdentifier) {
        if (instance == null) throw new ExceptionInInitializerError(
                TAG + "You need to initialize the library by calling World.init(getApplication) before any other method");
        for (final co.sentinel.lite.regional.Country c : allCountries) {
            if (c.hasIdentifier(countryIdentifier)) return c;
        }
        return co.sentinel.lite.regional.WorldBuilder.demoCountry();
    }

    /**
     * Get an immutable list of all the countries with their flags
     * <p>Pre-condition: <br>
     * {@link com.blongho.country_data.World#init(Context)} must have been called, otherwise you get an empty list</p>
     *
     * @return List of all the countries. <br> Attempting to modify this list invokes an exception and your app will
     *   crash.
     */
    @NonNull
    public static List<Country> getAllCountries() {
        if (instance == null) throw new ExceptionInInitializerError(
                TAG + "You need to initialize the library by calling World.init(getApplication) before any other method");
        return Collections.unmodifiableList(allCountries);
    }

    /**
     * Return all the currencies of the world
     * <p>Pre-condition: <br>
     * {@link com.blongho.country_data.World#init(Context)} must have been called, otherwise you get an empty list</p>
     *
     * @return The currencies of the world {alpha2, curencyName, currencyCode, currencySymbol} or an empty list if
     *   {@link com.blongho.country_data.World#init(Application)} has not been called
     */
}
