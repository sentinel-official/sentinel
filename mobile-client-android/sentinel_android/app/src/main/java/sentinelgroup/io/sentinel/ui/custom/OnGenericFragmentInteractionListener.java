package sentinelgroup.io.sentinel.ui.custom;

import android.content.Intent;
import android.support.v4.app.Fragment;

/**
 * This interface must be implemented by activities that contain
 * fragments to allow an interaction in this fragment to be communicated
 * to the activity and potentially other fragments contained in that
 * activity.
 * <p>
 * See the Android Training lesson <a href=
 * "http://developer.android.com/training/basics/fragments/communicating.html"
 * >Communicating with Other Fragments</a> for more information.
 */
public interface OnGenericFragmentInteractionListener {
    /**
     * This method is intended to pass the title to the activity implementing this callback from
     * the fragment contained in that activity
     *
     * @param iTitle [String] The title to be shown in the Toolbar
     */
    void onFragmentLoaded(String iTitle);

    /**
     * This method is intended to provide the attributes required to instantiate the ProgressDialog
     * and to instruct the activity implementing this callback to show the ProgressDialog from the
     * fragment contained in this activity
     *
     * @param isHalfDim [boolean] Dialog background - transparent or half dim
     * @param iMessage  [String] The loading message to be shown in the dialog
     */
    void onShowProgressDialog(boolean isHalfDim, String iMessage);

    /**
     * This method is intended to instruct the activity implementing this callback to hide the
     * ProgressDialog from the fragment contained in this activity
     */
    void onHideProgressDialog();

    /**
     * This method is intended to instruct the activity implementing this callback to show an Error
     * dialog with a Single button from the fragment contained in this activity
     *
     * @param iMessage [String] The error message to be shown in the dialog
     */
    void onShowSingleActionDialog(String iMessage);

    /**
     * This method is intended to instruct the activity implementing this callback to show an Error
     * dialog with two buttons from the fragment contained in this activity
     *
     * @param iMessage          [String] The error message to be shown in the dialog
     * @param iPositiveOptionId [int] The resource id of the positive button text
     * @param iNegativeOptionId [int] The resource id of the negative button text
     */
    void onShowDoubleActionDialog(String iMessage, int iPositiveOptionId, int iNegativeOptionId);

    /**
     * This method is intended to instruct the activity implementing this callback to copy the
     * string to the clipboard and shows a Toast on completing it from the fragment contained in
     * this activity
     *
     * @param iCopyString  [String] The text which needs to be copied to the clipboard
     * @param iToastTextId [int] The resource id of the toast message
     */
    void onCopyToClipboardClicked(String iCopyString, int iToastTextId);

    /**
     * This method is intended to instruct the activity implementing this callback to load the next
     * fragment into the container
     *
     * @param iNextFragment [Fragment] The new fragment to be loaded
     */
    void onLoadNextFragment(Fragment iNextFragment);

    /**
     * This method is intended to instruct the activity implementing this callback to load another
     * activity
     *
     * @param iIntent  [Intent] The intent to launch the new activity
     * @param iReqCode [int] The request code to be used if the request is to start an activity for
     *                 result
     */
    void onLoadNextActivity(Intent iIntent, int iReqCode);
}
