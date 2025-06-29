<?php

namespace App\Http\Controllers;

use App\Models\MealAssignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RiderDeliveryTrackerController extends Controller
{
    public function index()
    {
        $rider = Auth::user()->userable;

        $deliveries = MealAssignment::with(['meal', 'kitchenPartner', 'member', 'weeklyPlan'])
            ->where('rider_id', $rider->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($assignment) {
                return [
                    'id' => $assignment->id,
                    'status' => $assignment->status,
                    'day' => ucfirst($assignment->day),
                    'week' => $assignment->weeklyPlan->id ?? 'N/A',
                    'meal' => [
                        'name' => $assignment->meal->name ?? 'Unknown',
                    ],
                    'kitchen_partner' => $assignment->kitchenPartner->org_name ?? 'N/A',
                    'member' => $assignment->member
                        ? "{$assignment->member->first_name} {$assignment->member->last_name}"
                        : 'Unassigned',
                ];
            });

        return Inertia::render('Rider/DeliveryTracker', [
            'deliveries' => $deliveries,
        ]);
    }

    public function show($id)
    {
        $delivery = MealAssignment::with(['meal', 'kitchenPartner', 'member', 'weeklyPlan'])
            ->findOrFail($id);

        return Inertia::render('Rider/DeliveryDetails', [
            'delivery' => [
                'id' => $delivery->id,
                'status' => $delivery->status,
                'day' => ucfirst($delivery->day),
                'week' => $delivery->weeklyPlan->id ?? 'N/A',
                'meal' => [
                    'name' => $delivery->meal->name ?? 'Unknown',
                ],
                'kitchen_partner' => $delivery->kitchenPartner->org_name ?? 'N/A',
                'member' => $delivery->member
                    ? "{$delivery->member->first_name} {$delivery->member->last_name}"
                    : 'Unassigned',
            ],
            'route' => [
                'from' => [
                    'lat' => $delivery->kitchenPartner->user->location_lat,
                    'lng' => $delivery->kitchenPartner->user->location_lng,
                ],
                'to' => [
                    'lat' => $delivery->member->user->location_lat,
                    'lng' => $delivery->member->user->location_lng,
                ],
            ],
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => ['required', Rule::in(['on the way', 'delivered'])],
        ]);

        $delivery = MealAssignment::findOrFail($id);

        // 🚫 Prevent updating if already delivered
        if ($delivery->status === 'delivered') {
            return redirect()->route('rider.delivery.tracker')
                ->with('error', 'This delivery has already been marked as delivered and cannot be updated.');
        }

        $delivery->status = $request->status;
        $delivery->save();

        return redirect()->route('rider.delivery.tracker')
            ->with('success', 'Delivery status updated successfully.');
    }
}
