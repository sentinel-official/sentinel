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
    void onFragmentLoaded(String iTitle);

    void onShowProgressDialog(boolean isHalfDim, String iMessage);

    void onHideProgressDialog();

    void onShowSingleActionDialog(String iMessage);

    void onShowDoubleActionDialog(String iMessage, int iPositiveOptionId, int iNegativeOptionId);

    void onCopyToClipboardClicked(String iCopyString, int iToastTextId);

    void onLoadNextFragment(Fragment iNextFragment);

    void onLoadNextActivity(Intent iIntent, int iReqCode);
}
