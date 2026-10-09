package com.Hypermarketplace.backend.service;

import com.Hypermarketplace.backend.dto.BookingRequest;
import com.Hypermarketplace.backend.dto.BookingResponse;
import com.Hypermarketplace.backend.exception.ConflictException;
import com.Hypermarketplace.backend.exception.ResourceNotFoundException;
import com.Hypermarketplace.backend.model.Booking;
import com.Hypermarketplace.backend.model.BookingStatusEnum;
import com.Hypermarketplace.backend.model.Provider;
import com.Hypermarketplace.backend.model.Schedule;
import com.Hypermarketplace.backend.model.Service;
import com.Hypermarketplace.backend.model.WeekDay;
import com.Hypermarketplace.backend.repository.AddressRepository;
import com.Hypermarketplace.backend.repository.BookingRepository;
import com.Hypermarketplace.backend.repository.ProviderRepository;
import com.Hypermarketplace.backend.repository.ScheduleRepository;
import com.Hypermarketplace.backend.repository.ServiceRepository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;
    private final ProviderRepository providerRepository;
    private final ScheduleRepository scheduleRepository;
    private final AddressRepository addressRepository;

    public BookingService(BookingRepository bookingRepository, ServiceRepository serviceRepository,
                         ProviderRepository providerRepository, ScheduleRepository scheduleRepository,
                         AddressRepository addressRepository) {
        this.bookingRepository = bookingRepository;
        this.serviceRepository = serviceRepository;
        this.providerRepository = providerRepository;
        this.scheduleRepository = scheduleRepository;
        this.addressRepository = addressRepository;
    }

    public BookingResponse createBooking(String userId, BookingRequest request) {
        // Validate service exists and is active
        Service service = serviceRepository.findByIdAndActiveTrue(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found or inactive"));

        // Validate address exists and belongs to the customer
        addressRepository.findByIdAndUserId(request.getAddressId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found or you don't have permission to use it"));

        // Get the provider profile for the service owner
        Provider provider = providerRepository.findById(service.getProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found for this service"));

        // Validate booking time is within provider's schedule
        validateBookingSchedule(provider.getId(), request.getBookingDate(), request.getBookingTime());

        // Create booking with captured price
        Booking booking = new Booking();
        booking.setCustomerId(userId);
        booking.setProviderId(provider.getId());
        booking.setServiceId(request.getServiceId());
        booking.setAddressId(request.getAddressId());
        booking.setBookingDate(request.getBookingDate());
        booking.setBookingTime(request.getBookingTime());
        booking.setPrice(service.getPrice());
        booking.setStatus(BookingStatusEnum.PENDING);

        Booking savedBooking = bookingRepository.save(booking);
        return new BookingResponse(savedBooking);
    }

    public List<BookingResponse> getCustomerBookings(String userId) {
        List<Booking> bookings = bookingRepository.findByCustomerId(userId);
        return bookings.stream()
                .map(BookingResponse::new)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getProviderBookings(String userId) {
        // Get the provider profile for the authenticated user
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found for this user"));

        List<Booking> bookings = bookingRepository.findByProviderId(provider.getId());
        return bookings.stream()
                .map(BookingResponse::new)
                .collect(Collectors.toList());
    }

    public BookingResponse acceptBooking(String userId, String bookingId) {
        // Get the provider profile for the authenticated user
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found for this user"));

        Booking booking = bookingRepository.findByIdAndProviderId(bookingId, provider.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found or you don't have permission to accept it"));

        // Validate status transition
        validateStatusTransition(booking.getStatus(), BookingStatusEnum.ACCEPTED);

        booking.setStatus(BookingStatusEnum.ACCEPTED);
        Booking updatedBooking = bookingRepository.save(booking);
        return new BookingResponse(updatedBooking);
    }

    public BookingResponse rejectBooking(String userId, String bookingId) {
        // Get the provider profile for the authenticated user
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found for this user"));

        Booking booking = bookingRepository.findByIdAndProviderId(bookingId, provider.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found or you don't have permission to reject it"));

        // Validate status transition
        validateStatusTransition(booking.getStatus(), BookingStatusEnum.REJECTED);

        booking.setStatus(BookingStatusEnum.REJECTED);
        Booking updatedBooking = bookingRepository.save(booking);
        return new BookingResponse(updatedBooking);
    }

    public BookingResponse completeBooking(String userId, String bookingId) {
        // Get the provider profile for the authenticated user
        Provider provider = providerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found for this user"));

        Booking booking = bookingRepository.findByIdAndProviderId(bookingId, provider.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found or you don't have permission to complete it"));

        // Validate status transition - can only complete ACCEPTED bookings
        if (booking.getStatus() != BookingStatusEnum.ACCEPTED) {
            throw new ConflictException("Can only complete bookings with ACCEPTED status. Current status: " + booking.getStatus());
        }

        booking.setStatus(BookingStatusEnum.COMPLETED);
        Booking updatedBooking = bookingRepository.save(booking);
        return new BookingResponse(updatedBooking);
    }

    public BookingResponse cancelBooking(String userId, String bookingId) {
        Booking booking = bookingRepository.findByIdAndCustomerId(bookingId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found or you don't have permission to cancel it"));

        // Validate status transition
        validateStatusTransition(booking.getStatus(), BookingStatusEnum.CANCELLED);

        booking.setStatus(BookingStatusEnum.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);
        return new BookingResponse(updatedBooking);
    }

    private void validateBookingSchedule(String providerId, LocalDate bookingDate, LocalTime bookingTime) {
        // Convert LocalDate to WeekDay enum
        DayOfWeek javaDayOfWeek = bookingDate.getDayOfWeek();
        WeekDay weekDay = convertToWeekDay(javaDayOfWeek);

        // Find provider's schedule for this day
        Schedule schedule = scheduleRepository.findByProviderIdAndDayOfWeek(providerId, weekDay)
                .orElseThrow(() -> new ConflictException("Provider is not available on " + weekDay));

        // Check if schedule is available
        if (!schedule.isAvailable()) {
            throw new ConflictException("Provider is not available on " + weekDay);
        }

        // Validate booking time is within schedule hours
        if (bookingTime.isBefore(schedule.getStartTime()) || bookingTime.isAfter(schedule.getEndTime())) {
            throw new ConflictException("Booking time " + bookingTime + " is outside provider's available hours (" +
                    schedule.getStartTime() + " - " + schedule.getEndTime() + ") on " + weekDay);
        }
    }

    private void validateStatusTransition(BookingStatusEnum currentStatus, BookingStatusEnum newStatus) {
        switch (newStatus) {
            case ACCEPTED:
                if (currentStatus != BookingStatusEnum.PENDING) {
                    throw new ConflictException("Can only accept PENDING bookings. Current status: " + currentStatus);
                }
                break;
            case REJECTED:
                if (currentStatus != BookingStatusEnum.PENDING) {
                    throw new ConflictException("Can only reject PENDING bookings. Current status: " + currentStatus);
                }
                break;
            case COMPLETED:
                if (currentStatus != BookingStatusEnum.ACCEPTED) {
                    throw new ConflictException("Can only complete ACCEPTED bookings. Current status: " + currentStatus);
                }
                break;
            case CANCELLED:
                if (currentStatus != BookingStatusEnum.PENDING && currentStatus != BookingStatusEnum.ACCEPTED) {
                    throw new ConflictException("Can only cancel PENDING or ACCEPTED bookings. Current status: " + currentStatus);
                }
                break;
            default:
                throw new ConflictException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }
    }

    private WeekDay convertToWeekDay(DayOfWeek javaDayOfWeek) {
        switch (javaDayOfWeek) {
            case MONDAY: return WeekDay.MONDAY;
            case TUESDAY: return WeekDay.TUESDAY;
            case WEDNESDAY: return WeekDay.WEDNESDAY;
            case THURSDAY: return WeekDay.THURSDAY;
            case FRIDAY: return WeekDay.FRIDAY;
            case SATURDAY: return WeekDay.SATURDAY;
            case SUNDAY: return WeekDay.SUNDAY;
            default:
                throw new IllegalArgumentException("Unknown day of week: " + javaDayOfWeek);
        }
    }
}
