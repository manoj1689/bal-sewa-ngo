"""
Campaign routes.
"""

from fastapi import APIRouter, Depends, Query

from app.dependencies import get_current_admin
from app.schemas.actions import CampaignFeatureUpdate, CampaignStatusUpdate
from app.schemas.base import StandardResponse
from app.schemas.campaign import CampaignCreate, CampaignResponse, CampaignUpdate
from app.services.entities import CampaignService
from app.utils.pagination import Pagination

router = APIRouter(prefix="/campaigns", tags=["Campaigns"])
campaign_service = CampaignService()


@router.post("", response_model=StandardResponse)
async def create_campaign(
    data: CampaignCreate,
    current_user=Depends(get_current_admin),
):
    """Create a new campaign (admin only)."""
    campaign = await campaign_service.create_campaign(data)
    return StandardResponse(
        status="success",
        message="Campaign created successfully",
        data=CampaignResponse.model_validate(campaign),
    )


@router.get("", response_model=StandardResponse)
async def list_campaigns(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    """List all campaigns."""
    pagination = Pagination(page, limit)
    campaigns, total = await campaign_service.list_campaigns(
        pagination.skip,
        pagination.limit,
    )
    return StandardResponse(
        status="success",
        message="Campaigns fetched successfully",
        data=[CampaignResponse.model_validate(campaign) for campaign in campaigns],
        pagination=pagination.get_pagination_meta(total),
    )


@router.get("/active", response_model=StandardResponse)
async def list_active_campaigns():
    """List active campaigns."""
    campaigns = await campaign_service.list_active_campaigns()
    return StandardResponse(
        status="success",
        message="Active campaigns fetched successfully",
        data=[CampaignResponse.model_validate(campaign) for campaign in campaigns],
    )


@router.get("/featured", response_model=StandardResponse)
async def list_featured_campaigns():
    """List featured campaigns."""
    campaigns = await campaign_service.list_featured_campaigns()
    return StandardResponse(
        status="success",
        message="Featured campaigns fetched successfully",
        data=[CampaignResponse.model_validate(campaign) for campaign in campaigns],
    )


@router.get("/{campaign_id}", response_model=StandardResponse)
async def get_campaign(campaign_id: str):
    """Get campaign by ID."""
    campaign = await campaign_service.get_campaign(campaign_id)
    return StandardResponse(
        status="success",
        message="Campaign fetched successfully",
        data=CampaignResponse.model_validate(campaign),
    )


@router.put("/{campaign_id}", response_model=StandardResponse)
async def update_campaign(
    campaign_id: str,
    data: CampaignUpdate,
    current_user=Depends(get_current_admin),
):
    """Update campaign (admin only)."""
    campaign = await campaign_service.update_campaign(campaign_id, data)
    return StandardResponse(
        status="success",
        message="Campaign updated successfully",
        data=CampaignResponse.model_validate(campaign),
    )


@router.delete("/{campaign_id}", response_model=StandardResponse)
async def delete_campaign(
    campaign_id: str,
    current_user=Depends(get_current_admin),
):
    """Delete campaign (admin only)."""
    await campaign_service.repo.delete(campaign_id)
    return StandardResponse(
        status="success",
        message="Campaign deleted successfully",
    )


@router.patch("/{campaign_id}/feature", response_model=StandardResponse)
async def feature_campaign(
    campaign_id: str,
    data: CampaignFeatureUpdate,
    current_user=Depends(get_current_admin),
):
    """Feature or unfeature a campaign (admin only)."""
    campaign = await campaign_service.update_campaign(
        campaign_id,
        CampaignUpdate(is_featured=data.is_featured),
    )
    return StandardResponse(
        status="success",
        message="Campaign feature status updated successfully",
        data=CampaignResponse.model_validate(campaign),
    )


@router.patch("/{campaign_id}/status", response_model=StandardResponse)
async def update_campaign_status(
    campaign_id: str,
    data: CampaignStatusUpdate,
    current_user=Depends(get_current_admin),
):
    """Update campaign status (admin only)."""
    campaign = await campaign_service.update_campaign(
        campaign_id,
        CampaignUpdate(status=data.status),
    )
    return StandardResponse(
        status="success",
        message="Campaign status updated successfully",
        data=CampaignResponse.model_validate(campaign),
    )
