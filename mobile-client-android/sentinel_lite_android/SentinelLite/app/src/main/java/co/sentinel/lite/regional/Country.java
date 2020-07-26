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
import android.support.annotation.AnyThread;
import android.support.annotation.DrawableRes;

/**
 * A country is represented by the name, the 2 letter representation, the 3 letter representation. It is non-mutable
 * <p>The user should not be able to create a new Country as in real life,   countries are not just created. </p>
 *
 * @author Bernard Che Longho (blongho02@gmail.com)
 * @since 2019 -05-10
 */
@AnyThread
public final class Country extends CountryBase {
    private final static String UNKNOWN = "UNKNOWN";
    @DrawableRes
    private int flagResource; // The image resource that represent the
    private co.sentinel.lite.regional.CountryExtras extras;

    Country(
            final String id, final String name, final String alpha2, final String alpha3) {
        super(id, name, alpha2, alpha3);
    }

    /**
     * Get the image resouce of the country
     *
     * @return The R.drawable.id representing the flag of the country
     */

    void setFlagResource(final int flagResource) {
        this.flagResource = flagResource;
    }

    /**
     * Get the currency for this country
     *
     * @return The country currency
     */


    /**
     * Get capital
     *
     * @return the capital city of the country or "UNKNOWN" if the value is not available
     */

    /**
     * Get continent
     *
     * @return the continent where this country is located or "UNKNOWN" if for some reason, the extra information is
     * not
     *   available
     */
    public final String getContinent() {
        return extras != null ? co.sentinel.lite.regional.Continents.continentMap.get(extras.getContinent().toUpperCase()) : UNKNOWN;
    }

    /**
     * Get the surface area of this country (km^2)
     *
     * @return the surface area of this country in kilometers squared or 0 if the value is not known
     */

    /**
     * Get population
     *
     * @return the population of this country or O if the value is not none
     */

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("Country{");
        sb.append(super.toString());
        sb.append("flagResource=").append(flagResource);
        sb.append(", extras=").append(extras);
        sb.append('}');
        return sb.toString();
    }

    void setExtras(final co.sentinel.lite.regional.CountryExtras extras) {
        this.extras = extras;
    }
}