package co.sentinel.sentinellite.util;

import android.content.Context;

import co.sentinel.sentinellite.R;
import io.branch.indexing.BranchUniversalObject;
import io.branch.referral.util.LinkProperties;

public class BranchUrlHelper {

    private Context mContext;

    public BranchUrlHelper(Context iContext) {
        mContext = iContext;
    }

    public void createLink(String iReferralId, BranchUrlGenerator iGenerator) {
        BranchUniversalObject buo = new BranchUniversalObject()
                .setTitle(mContext.getString(R.string.branch_share_title))
                .setContentDescription(mContext.getString(R.string.branch_share_desc, iReferralId))
                .setContentIndexingMode(BranchUniversalObject.CONTENT_INDEX_MODE.PUBLIC)
                .setLocalIndexMode(BranchUniversalObject.CONTENT_INDEX_MODE.PUBLIC);

        LinkProperties lp = new LinkProperties()
                .addControlParameter(AppConstants.BRANCH_REFERRAL_ID, iReferralId);

        buo.generateShortUrl(mContext, lp, (url, error) -> {
            if (error == null) {
                iGenerator.onUrlGenerated(url);
            }
        });
    }

    public interface BranchUrlGenerator {
        void onUrlGenerated(String iUrl);
    }
}
